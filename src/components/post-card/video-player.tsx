import { useCallback, useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { Play, Maximize, RotateCcw, LoaderCircle } from "lucide-react";

type Props = {
  url: string;
  posterUrl?: string;
  isActive?: boolean;
  fit?: "cover" | "contain";
};

type VideoEngine = "HLS_JS" | "NATIVE_HLS" | "DIRECT" | "UNSUPPORTED";

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
  const hasStartedRef = useRef(false);
  const hlsRetryPendingRef = useRef(false);
  const hlsSourceRequestedRef = useRef(false);
  const hasPlayedSuccessfullyRef = useRef(false);

  // HLS 재생 엔진 및 요청 정리
  const hlsRef = useRef<Hls | null>(null);
  const engineRef = useRef<VideoEngine>("DIRECT");
  const sourceGenerationRef = useRef(0);
  const nativeCheckRef = useRef<AbortController | null>(null);
  const readyStatusRef = useRef<VideoReadyStatus>("IDLE");
  const isHls = /\.m3u8(?:[?#]|$)/i.test(url);

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

  const changeReadyStatus = useCallback((status: VideoReadyStatus) => {
    readyStatusRef.current = status;
    setReadyStatus(status);
  }, []);

  const startLoading = () => {
    setIsLoading(true);
  };

  const stopLoading = () => {
    setIsLoading(false);
    setShowSpinner(false);
  };

  // 네이티브 HLS: video.error에는 HTTP 코드가 없으므로 실패했을 때만 manifest 조회
  // CORS로 조회할 수 없다면 404라고 추정하지 않고 일반 오류로 처리
  const checkNativeManifest = useCallback(
    async (requestUrl: string, reloadWhenReady: boolean) => {
      if (nativeCheckRef.current) return;

      const controller = new AbortController();
      const generation = sourceGenerationRef.current;
      nativeCheckRef.current = controller;

      try {
        const response = await fetch(requestUrl, {
          cache: "no-store",
          signal: controller.signal,
        });

        if (
          controller.signal.aborted ||
          generation !== sourceGenerationRef.current ||
          readyStatusRef.current === "TIMEOUT"
        )
          return;

        if (response.status === 404) {
          changeReadyStatus("PROCESSING");
          return;
        }

        if (!response.ok || !reloadWhenReady) {
          // manifest가 200인데 네이티브 재생 오류라면 인코딩 중으로 보지 않음
          changeReadyStatus("ERROR");
          return;
        }

        const video = videoRef.current;
        if (!video || engineRef.current !== "NATIVE_HLS") return;

        changeReadyStatus("IDLE");
        video.src = requestUrl;
        video.load();
      } catch {
        if (
          !controller.signal.aborted &&
          generation === sourceGenerationRef.current &&
          readyStatusRef.current !== "TIMEOUT"
        ) {
          changeReadyStatus("ERROR");
        }
      } finally {
        if (nativeCheckRef.current === controller) {
          nativeCheckRef.current = null;
        }
      }
    },
    [changeReadyStatus],
  );

  // 다른 동영상 URL로 전환되면 상태 초기화 및 재생 엔진 교체
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    sourceGenerationRef.current += 1;
    const generation = sourceGenerationRef.current;
    retryTicksRef.current = 0;
    retryCountRef.current = 0;
    hasStartedRef.current = false;
    hlsRetryPendingRef.current = false;
    hlsSourceRequestedRef.current = false;
    hasPlayedSuccessfullyRef.current = false;
    changeReadyStatus("IDLE");
    setHasStarted(false);
    setIsPlaying(false);
    setIsEnded(false);
    setCurrentTime(0);
    setDuration(0);
    setIsLoading(false);
    setShowSpinner(false);
    nativeFullscreenRef.current = false;
    video.controls = false;

    nativeCheckRef.current?.abort();
    nativeCheckRef.current = null;
    hlsRef.current?.destroy();
    hlsRef.current = null;
    video.pause();
    if (activeVideo === video) activeVideo = null;
    video.removeAttribute("src");
    video.load();

    if (!isHls) {
      // Object URL 및 일반 MP4: 기존 네이티브 video 재생 유지
      engineRef.current = "DIRECT";
      video.src = url;
      video.load();
    } else if (Hls.isSupported()) {
      engineRef.current = "HLS_JS";

      // manifest 404는 기존 5초 재시도에서 처리하므로 hls.js 자체 재시도는 제거
      const noRetryPolicy = {
        default: {
          maxTimeToFirstByteMs: 10_000,
          maxLoadTimeMs: 20_000,
          timeoutRetry: null,
          errorRetry: null,
        },
      };
      const hls = new Hls({
        manifestLoadPolicy: noRetryPolicy,
        playlistLoadPolicy: noRetryPolicy,
      });
      hlsRef.current = hls;

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (
          sourceGenerationRef.current !== generation ||
          hlsRef.current !== hls
        )
          return;
        hlsRetryPendingRef.current = false;
        // 목록 파싱 성공은 재생 성공과 다름. 실제 READY는 video.canplay에서 변경
        if (readyStatusRef.current === "PROCESSING") {
          changeReadyStatus("IDLE");
        }
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (
          sourceGenerationRef.current !== generation ||
          hlsRef.current !== hls ||
          readyStatusRef.current === "TIMEOUT"
        )
          return;

        const isPlaylistError =
          data.details === Hls.ErrorDetails.MANIFEST_LOAD_ERROR ||
          data.details === Hls.ErrorDetails.LEVEL_LOAD_ERROR;
        if (isPlaylistError) hlsRetryPendingRef.current = false;

        if (
          isPlaylistError &&
          data.response?.code === 404 &&
          !hasPlayedSuccessfullyRef.current
        ) {
          video.pause();
          setIsPlaying(false);
          stopLoading();

          hls.stopLoad();
          changeReadyStatus("PROCESSING");
          return;
        }

        // manifest/level 오류는 자체 중복 재시도 없이 직접 처리
        if (!isPlaylistError && !data.fatal) return;
        hls.stopLoad();
        changeReadyStatus("ERROR");
      });

      // 재생 버튼을 누르기 전에는 Cloudflare HLS 요청을 보내지 않음
      hls.attachMedia(video);
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // hls.js 미지원(iOS 등): 최초 재생 클릭 시 소스 연결
      engineRef.current = "NATIVE_HLS";
    } else {
      engineRef.current = "UNSUPPORTED";
      changeReadyStatus("UNSUPPORTED");
    }

    return () => {
      // 언마운트 및 URL 변경 시 오래된 비동기 이벤트가 상태를 변경하지 못하도록 함
      sourceGenerationRef.current += 1;
      nativeCheckRef.current?.abort();
      nativeCheckRef.current = null;
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      video.pause();
      if (activeVideo === video) activeVideo = null;
      video.removeAttribute("src");
      video.load();
    };
  }, [url, isHls, changeReadyStatus]);

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
        changeReadyStatus("READY");
        return;
      }

      retryTicksRef.current += 1;
      if (retryTicksRef.current >= MAX_RETRY_TICKS) {
        hlsRef.current?.stopLoad();
        nativeCheckRef.current?.abort();
        changeReadyStatus("TIMEOUT");
        return;
      }

      retryCountRef.current += 1;
      const attempt = retryCountRef.current;
      const reloadUrl = makeReloadUrl(url, `${Date.now()}-${attempt}`);

      // 동일 URL의 실패 응답이 캐시될 수 있어 manifest 주소를 갱신
      if (engineRef.current === "HLS_JS") {
        // hls.js가 video의 src(MediaSource)를 관리하므로 직접 변경하지 않음
        if (!hlsRetryPendingRef.current && hlsRef.current) {
          hlsRetryPendingRef.current = true;
          hlsRef.current.loadSource(reloadUrl);
        }
      } else if (engineRef.current === "NATIVE_HLS") {
        // HTTP 응답을 확인하고 200일 때만 네이티브 video를 재로딩
        void checkNativeManifest(reloadUrl, true);
      }
    }, RETRY_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [
    readyStatus,
    isActive,
    isInView,
    isPageVisible,
    url,
    changeReadyStatus,
    checkNativeManifest,
  ]);

  // 로딩이 200ms 이상 지속될 때만 스피너 표시
  useEffect(() => {
    if (!isLoading) return;

    const timer = window.setTimeout(() => {
      setShowSpinner(true);
    }, 200);

    return () => window.clearTimeout(timer);
  }, [isLoading]);

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

      if (engineRef.current === "HLS_JS" && !hlsSourceRequestedRef.current) {
        hlsSourceRequestedRef.current = true;
        hlsRef.current?.loadSource(url);
      } else if (
        engineRef.current === "NATIVE_HLS" &&
        !video.hasAttribute("src")
      ) {
        video.src = url;
        video.load();
      }

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

    // hls.js가 오류와 HTTP 응답을 직접 판별함
    if (engineRef.current === "HLS_JS") return;
    if (
      readyStatusRef.current === "PROCESSING" ||
      readyStatusRef.current === "TIMEOUT"
    )
      return;

    if (
      engineRef.current === "NATIVE_HLS" &&
      !hasPlayedSuccessfullyRef.current &&
      video.error?.code === 4
    ) {
      // 네이티브 HLS에서는 video.error만으로 404인지 확인 불가
      void checkNativeManifest(url, false);
      return;
    }

    // Object URL/MP4 및 그 외 영상 오류는 인코딩 중으로 간주하지 않음
    changeReadyStatus("ERROR");
  };

  // 1분 종료 후 사용자가 누르면 새 1분 확인 시작
  const handleManualRetry = () => {
    const video = videoRef.current;
    if (!video) return;

    retryTicksRef.current = 0;
    retryCountRef.current = 0;
    hlsRetryPendingRef.current = false;
    nativeCheckRef.current?.abort();
    nativeCheckRef.current = null;
    stopLoading();
    changeReadyStatus("IDLE");

    const reloadUrl = makeReloadUrl(url, `manual-${Date.now()}`);

    // 바로 한 번 불러오고, 이후 404가 확인된 경우에만 5초마다 재확인
    if (engineRef.current === "HLS_JS") {
      hlsRetryPendingRef.current = true;
      hlsRef.current?.loadSource(reloadUrl);
    } else if (engineRef.current === "NATIVE_HLS") {
      void checkNativeManifest(reloadUrl, true);
    } else if (engineRef.current === "DIRECT") {
      video.src = url;
      video.load();
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden bg-black"
    >
      {/* 영상 */}
      <video
        ref={videoRef}
        poster={posterUrl}
        playsInline
        preload={isHls ? "none" : "metadata"}
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

          hasStartedRef.current = true;
          setHasStarted(true);
          setIsPlaying(true);
          setIsEnded(false);
        }}
        onPlaying={() => {
          hasPlayedSuccessfullyRef.current = true;
          changeReadyStatus("READY");
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
          if (!e.currentTarget.error) {
            changeReadyStatus("READY");
          }
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
          <span className="text-sm font-medium">동영상 준비 중...</span>
          <span className="text-xs text-white/70">
            잠시 후 재생할 수 있습니다
          </span>
        </div>
      )}

      {/* 1분 자동 확인 종료: 사용자 선택으로 새 1분 재시도 */}
      {readyStatus === "TIMEOUT" && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-black/60 text-white">
          <span className="text-sm font-medium">
            동영상 준비가 지연되고 있습니다.
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
