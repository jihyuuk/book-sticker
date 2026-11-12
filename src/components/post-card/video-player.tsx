import { useEffect, useRef, useState } from "react";
import { Play, Maximize, RotateCcw, LoaderCircle } from "lucide-react";

type Props = {
  url: string;
  posterUrl?: string;
  isActive?: boolean;
  fit?: "cover" | "contain";
};

let activeVideo: HTMLVideoElement | null = null;

export default function VideoPlayer({
  url,
  posterUrl,
  isActive = true,
  fit = "cover",
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // 기본 전체화면 사용 여부
  const nativeFullscreenRef = useRef(false);

  const [hasStarted, setHasStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // 로딩 상태
  const [isLoading, setIsLoading] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);

  // 로딩이 200ms 이상 지속될 때만 스피너 표시
  useEffect(() => {
    if (!isLoading) return;

    const timer = window.setTimeout(() => {
      setShowSpinner(true);
    }, 200);

    return () => window.clearTimeout(timer);
  }, [isLoading]);

  const startLoading = () => {
    setIsLoading(true);
  };

  const stopLoading = () => {
    setIsLoading(false);
    setShowSpinner(false);
  };

  // 캐러셀에서 다른 슬라이드로 이동하면 일시정지
  useEffect(() => {
    if (!isActive) {
      videoRef.current?.pause();
    }
  }, [isActive]);

  // 화면에서 50% 이상 벗어나면 일시정지
  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;

    if (!container || !video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // 전체화면에서는 가시성 감지 무시
        if (nativeFullscreenRef.current) return;

        if (entry.intersectionRatio < 0.5) {
          video.pause();
        }
      },
      { threshold: [0, 0.5] },
    );

    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  // 컴포넌트 제거 시 정리
  useEffect(() => {
    const video = videoRef.current;

    return () => {
      video?.pause();

      if (activeVideo === video) {
        activeVideo = null;
      }
    };
  }, []);

  // 전체화면 종료 시 커스텀 플레이어 복구
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const restoreCustomControls = () => {
      nativeFullscreenRef.current = false;
      video.controls = false;
    };

    // PC / Android 등의 Fullscreen API
    const handleFullscreenChange = () => {
      if (document.fullscreenElement === video) {
        nativeFullscreenRef.current = true;
      } else {
        // 이 이벤트는 iOS 전용 전체화면 종료와 별개
        if (!iosFullscreenActive) {
          restoreCustomControls();
        }
      }
    };

    let iosFullscreenActive = false;

    // iPhone Safari 전체화면 진입
    const handleIOSFullscreenBegin = () => {
      iosFullscreenActive = true;
      nativeFullscreenRef.current = true;
      video.controls = true;
    };

    // iPhone Safari 전체화면 종료
    const handleIOSFullscreenEnd = () => {
      iosFullscreenActive = false;
      restoreCustomControls();
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    video.addEventListener("webkitbeginfullscreen", handleIOSFullscreenBegin);

    video.addEventListener("webkitendfullscreen", handleIOSFullscreenEnd);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);

      video.removeEventListener(
        "webkitbeginfullscreen",
        handleIOSFullscreenBegin,
      );

      video.removeEventListener("webkitendfullscreen", handleIOSFullscreenEnd);
    };
  }, []);

  // 재생 / 일시정지
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video || !isActive) return;

    // 기본 플레이어에서는 브라우저가 재생 제어
    if (nativeFullscreenRef.current) return;

    if (video.paused) {
      if (video.ended) {
        video.currentTime = 0;
        setCurrentTime(0);
      }

      startLoading();

      void video.play().catch(() => {
        stopLoading();
      });
    } else {
      video.pause();
    }
  };

  // 진행 바 위치 즉시 반영
  const updateProgress = (time: number, total: number) => {
    if (!progressRef.current) return;

    const progress =
      Number.isFinite(total) && total > 0
        ? Math.min(100, (time / total) * 100)
        : 0;

    progressRef.current.style.width = `${progress}%`;
  };

  // 재생 중 진행 바를 매 프레임 갱신
  useEffect(() => {
    if (!isPlaying) return;

    const video = videoRef.current;
    if (!video) return;

    let frameId: number;

    const animate = () => {
      updateProgress(video.currentTime, video.duration);
      frameId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(frameId);
  }, [isPlaying]);

  // 재생 위치 변경
  const handleSeek = (value: number) => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration)) return;

    startLoading();

    video.currentTime = value;

    setCurrentTime(value);
    setIsEnded(false);

    updateProgress(value, video.duration);
  };

  // 브라우저 기본 플레이어 전체화면
  const toggleFullscreen = async () => {
    const video = videoRef.current;
    if (!video) return;

    const iosVideo = video as HTMLVideoElement & {
      webkitEnterFullscreen?: () => void;
    };

    // 전체화면에서는 기본 컨트롤 활성화
    video.controls = true;
    nativeFullscreenRef.current = true;

    // PC / Android 등의 Fullscreen API
    if (document.fullscreenEnabled && video.requestFullscreen) {
      try {
        await video.requestFullscreen();
        return;
      } catch {
        // 실패하면 iOS 방식 시도
      }
    }

    // iPhone Safari
    if (iosVideo.webkitEnterFullscreen) {
      try {
        iosVideo.webkitEnterFullscreen();
        return;
      } catch {
        // 전체화면 진입 실패
      }
    }

    // 전체화면을 지원하지 않으면 원래대로 복구
    nativeFullscreenRef.current = false;
    video.controls = false;
  };

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden bg-black"
    >
      {/* 영상 */}
      <video
        ref={videoRef}
        src={`${url}#t=0.001`}
        poster={posterUrl}
        playsInline
        preload="metadata"
        disablePictureInPicture
        disableRemotePlayback
        controlsList="noremoteplayback"
        className={`h-full w-full ${
          fit === "contain" ? "object-contain" : "object-cover"
        } fullscreen:!h-screen fullscreen:!w-screen fullscreen:!object-contain`}
        onClick={togglePlay}
        onPlay={(e) => {
          const video = e.currentTarget;

          if (!isActive) {
            video.pause();
            return;
          }

          if (activeVideo && activeVideo !== video) {
            activeVideo.pause();
          }

          activeVideo = video;

          setHasStarted(true);
          setIsPlaying(true);
          setIsEnded(false);
        }}
        onPlaying={() => {
          stopLoading();
        }}
        onPause={(e) => {
          if (activeVideo === e.currentTarget) {
            activeVideo = null;
          }

          setIsPlaying(false);
          stopLoading();
        }}
        onEnded={(e) => {
          if (activeVideo === e.currentTarget) {
            activeVideo = null;
          }

          setIsPlaying(false);
          setIsEnded(true);
          stopLoading();
        }}
        onWaiting={(e) => {
          if (!e.currentTarget.paused || e.currentTarget.seeking) {
            startLoading();
          }
        }}
        onSeeking={() => {
          if (hasStarted) {
            startLoading();
          }
        }}
        onSeeked={(e) => {
          updateProgress(e.currentTarget.currentTime, e.currentTarget.duration);

          stopLoading();
        }}
        onCanPlay={(e) => {
          if (!e.currentTarget.seeking) {
            stopLoading();
          }
        }}
        onDurationChange={(e) => {
          const value = e.currentTarget.duration;

          setDuration(Number.isFinite(value) ? value : 0);
        }}
        onTimeUpdate={(e) => {
          setCurrentTime(e.currentTarget.currentTime);
        }}
        onError={stopLoading}
      />

      {/* 중앙 로딩 스피너 */}
      {showSpinner && (
        <div className="pointer-events-none absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
          <LoaderCircle className="size-6 animate-spin text-white drop-shadow-md" />
        </div>
      )}

      {/* 최초 재생 / 일시정지 / 재생 종료 */}
      {!isPlaying && !showSpinner && (
        <button
          type="button"
          onClick={togglePlay}
          onPointerDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          aria-label={
            isEnded ? "다시 재생" : !hasStarted ? "동영상 재생" : "재생 재개"
          }
          className="absolute top-1/2 left-1/2 flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/60"
        >
          {isEnded ? (
            <RotateCcw className="size-7" />
          ) : (
            <Play className="size-7 fill-current" />
          )}
        </button>
      )}

      {/* 최초 재생 이후 컨트롤 유지 */}
      {hasStarted && (
        <>
          {/* 전체화면 버튼 */}
          <button
            type="button"
            onClick={() => void toggleFullscreen()}
            onPointerDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            aria-label="전체화면"
            className="absolute right-2 bottom-4 z-10 flex size-7 items-center justify-center rounded-full bg-black/40 text-white"
          >
            <Maximize className="size-4" />
          </button>

          {/* 진행 바 */}
          <div
            className="group/seek absolute inset-x-0 bottom-0 z-10 h-5 touch-none"
            onPointerDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
          >
            {/* 배경 트랙 */}
            <div className="absolute inset-x-0 bottom-0 h-[6px] bg-white/40">
              {/* 재생 진행률 */}
              <div
                ref={progressRef}
                className="h-full bg-sky-500"
                style={{ width: "0%" }}
              />
            </div>

            {/* 드래그 영역 */}
            <input
              type="range"
              min={0}
              max={duration || 1}
              step={0.1}
              value={Math.min(currentTime, duration || 1)}
              disabled={duration <= 0}
              onChange={(e) => handleSeek(Number(e.target.value))}
              aria-label="동영상 재생 위치"
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-default"
            />
          </div>
        </>
      )}
    </div>
  );
}
