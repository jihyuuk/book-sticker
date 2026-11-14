import { useEffect, useRef, useState } from "react";
import { Play, Maximize, RotateCcw, LoaderCircle } from "lucide-react";

type Props = {
  url: string;
  posterUrl?: string;
  isActive?: boolean;
  fit?: "cover" | "contain";
};

type VideoReadyStatus =
  "IDLE" | "PROCESSING" | "READY" | "TIMEOUT" | "ERROR" | "UNSUPPORTED";

const RETRY_INTERVAL_MS = 5_000;
const MAX_RETRY_TICKS = 12; // 5초 * 12 = 약 1분

// 재시도할 때 이전 실패 응답이 브라우저 캐시에 남지 않도록 URL 변경
// Cloudflare의 공개 HLS manifest 주소에만 사용하는 전제
function makeReloadUrl(url: string, attempt: string) {
  const nextUrl = new URL(url, window.location.href);
  nextUrl.searchParams.set("_retry", attempt);
  nextUrl.hash = "t=0.001";
  return nextUrl.toString();
}

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
  const retryTicksRef = useRef(0);
  const retryCountRef = useRef(0);

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

  // 최초 재생 준비 / 변환 추정 오류 / 시간 초과
  const [readyStatus, setReadyStatus] = useState<VideoReadyStatus>("IDLE");
  const [isInView, setIsInView] = useState(true);
  const [isPageVisible, setIsPageVisible] = useState(
    () => document.visibilityState === "visible",
  );

  // 다른 동영상 URL로 전환되면 상태 초기화
  useEffect(() => {
    retryTicksRef.current = 0;
    retryCountRef.current = 0;
    setReadyStatus("IDLE");
    setHasStarted(false);
    setIsPlaying(false);
    setIsEnded(false);
    setCurrentTime(0);
    setDuration(0);
    setIsLoading(false);
    setShowSpinner(false);
  }, [url]);

  // 백그라운드 탭에서는 재시도 중지
  useEffect(() => {
    const onVisibilityChange = () => {
      setIsPageVisible(document.visibilityState === "visible");
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  // 변환 중으로 추정되는 영상만 5초마다 재로딩
  // 화면 밖/다른 슬라이드/백그라운드에서는 시간 카운트도 일시정지
  useEffect(() => {
    if (
      readyStatus !== "PROCESSING" ||
      !isActive ||
      !isInView ||
      !isPageVisible
    )
      return;

    const timer = window.setInterval(() => {
      const video = videoRef.current;
      if (!video) return;

      // 재시도 사이 이미 재생 준비가 되었다면 종료
      if (
        video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA &&
        !video.error
      ) {
        setReadyStatus("READY");
        return;
      }

      retryTicksRef.current += 1;
      if (retryTicksRef.current >= MAX_RETRY_TICKS) {
        setReadyStatus("TIMEOUT");
        return;
      }

      retryCountRef.current += 1;
      const attempt = retryCountRef.current;

      // 동일 URL의 실패 응답이 캐시될 수 있어 manifest 주소를 갱신
      video.src = makeReloadUrl(url, `${Date.now()}-${attempt}`);
      video.load();
    }, RETRY_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [readyStatus, isActive, isInView, isPageVisible, url]);

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

        const visible = entry.intersectionRatio >= 0.5;
        setIsInView(visible);
        if (!visible) {
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
    if (["PROCESSING", "TIMEOUT", "ERROR", "UNSUPPORTED"].includes(readyStatus))
      return;

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

  // 처음 로딩할 때 소스를 해석하지 못한 경우 자동 재확인
  const handleVideoError = () => {
    stopLoading();
    const video = videoRef.current;
    if (!video) return;

    // 이미 폴링 중이면 다음 5초 재시도를 기다림
    if (readyStatus === "PROCESSING" || readyStatus === "TIMEOUT") return;

    if (!hasStarted && video.error?.code === 4) {
      const supportsHls =
        video.canPlayType("application/vnd.apple.mpegurl") !== "";

      if (!supportsHls) {
        setReadyStatus("UNSUPPORTED");
        return;
      }

      retryTicksRef.current = 0;
      retryCountRef.current = 0;

      setReadyStatus("PROCESSING");
      return;
    }
    // 인코딩 여부를 판단할 수 없는 다른 오류

    setReadyStatus("ERROR");
  };

  // 1분 종료 후 사용자가 누르면 새 1분 확인 시작
  const handleManualRetry = () => {
    const video = videoRef.current;
    if (!video) return;

    retryTicksRef.current = 0;
    retryCountRef.current = 0;
    stopLoading();

    setReadyStatus("PROCESSING");

    // 바로 한 번 불러오고, 이후 5초마다 확인
    video.src = makeReloadUrl(url, `manual-${Date.now()}`);
    video.load();
  };

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden bg-black"
    >
      {/* 영상 */}
      <video
        ref={videoRef}
        src={url}
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
        onError={handleVideoError}
      />

      {readyStatus === "UNSUPPORTED" && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 text-white">
          <span className="text-sm font-medium">
            이 브라우저에서는 동영상을 재생할 수 없습니다.
          </span>
        </div>
      )}

      {/* 아직 재생할 수 없는 영상: 준비 중 화면 */}
      {readyStatus === "PROCESSING" && (
        <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 bg-black/50 text-white">
          <LoaderCircle className="size-6 animate-spin" />
          <span className="text-sm font-medium">동영상 변환 중...</span>
          <span className="text-xs text-white/70">
            잠시 후 재생할 수 있습니다
          </span>
        </div>
      )}

      {/* 1분 자동 확인 종료: 사용자 선택으로 새 1분 재시도 */}
      {readyStatus === "TIMEOUT" && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-black/60 text-white">
          <span className="text-sm font-medium">
            동영상 변환이 지연되고 있습니다.
          </span>
          <button
            type="button"
            onClick={handleManualRetry}
            onPointerDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            className="flex items-center gap-2 rounded-md bg-white/15 px-4 py-2 text-sm hover:bg-white/25"
          >
            <RotateCcw className="size-4" />
            다시 확인하기
          </button>
        </div>
      )}

      {/* 인코딩 중이라고 판단할 수 없는 일반 오류 */}
      {readyStatus === "ERROR" && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-black/60 text-white">
          <span className="text-sm font-medium">
            동영상을 불러올 수 없습니다.
          </span>
          <button
            type="button"
            onClick={handleManualRetry}
            onPointerDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            className="flex items-center gap-2 rounded-md bg-white/15 px-4 py-2 text-sm hover:bg-white/25"
          >
            <RotateCcw className="size-4" />
            다시 확인하기
          </button>
        </div>
      )}

      {/* 기존 재생 중 로딩 스피너 */}
      {readyStatus !== "PROCESSING" && showSpinner && (
        <div className="pointer-events-none absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
          <LoaderCircle className="size-6 animate-spin text-white drop-shadow-md" />
        </div>
      )}

      {/* 최초 재생 / 일시정지 / 재생 종료 */}
      {!isPlaying &&
        !showSpinner &&
        readyStatus !== "PROCESSING" &&
        readyStatus !== "TIMEOUT" &&
        readyStatus !== "ERROR" &&
        readyStatus !== "UNSUPPORTED" && (
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
