import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import BookBarcodeImagePicker from "./book-barcode-image-picker";

type Props = {
  onImageSelect: (file: File) => void;
  active: boolean;
};

// 비디오 프레임 캡처
function captureVideoFrame(video: HTMLVideoElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    if (!video.videoWidth || !video.videoHeight) {
      reject(new Error("비디오가 준비되지 않았습니다."));
      return;
    }

    const canvas = document.createElement("canvas");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");

    if (!context) {
      reject(new Error("Canvas 생성 실패"));
      return;
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("이미지 변환 실패"));
        }
      },
      "image/jpeg",
      0.95,
    );
  });
}

// 최소 FPS를 유지하면서 높은 해상도 요청
async function configureCamera(track: MediaStreamTrack) {
  const capabilities = track.getCapabilities?.();

  const maxWidth = capabilities?.width?.max;
  const maxHeight = capabilities?.height?.max;

  // 1. 최대 해상도 우선 요청
  try {
    await track.applyConstraints({
      ...(maxWidth && { width: { ideal: maxWidth } }),
      ...(maxHeight && { height: { ideal: maxHeight } }),
      frameRate: {
        min: 24,
        ideal: 30,
      },
    });

    return;
  } catch {
    // 조건을 만족하지 못하면 낮은 해상도로 재시도
  }

  // 2. FHD → HD 순서로 재시도
  const resolutions = [
    { width: 1920, height: 1080 },
    { width: 1280, height: 720 },
  ];

  for (const resolution of resolutions) {
    try {
      await track.applyConstraints({
        width: {
          ideal: resolution.width,
          max: resolution.width,
        },
        height: {
          ideal: resolution.height,
          max: resolution.height,
        },
        frameRate: {
          min: 24,
          ideal: 30,
        },
      });

      return;
    } catch {
      // 실패하면 다음 해상도로 재시도
    }
  }

  throw new Error("최소 24FPS를 지원하는 카메라 설정을 찾지 못했습니다.");
}

export default function BookBarcodeCamera({ onImageSelect, active }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const isCapturingRef = useRef(false);
  const mountedRef = useRef(false);
  const activeRef = useRef(active);
  const captureIdRef = useRef(0);

  // 카메라 실행
  useEffect(() => {
    let stream: MediaStream | null = null;
    let attachedVideo: HTMLVideoElement | null = null;
    let cancelled = false;

    mountedRef.current = true;

    const start = async () => {
      try {
        // 1. 카메라 연결
        const nextStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: "environment" },
          },
          audio: false,
        });

        stream = nextStream;

        if (cancelled) {
          nextStream.getTracks().forEach((track) => track.stop());
          return;
        }

        // 2. 해상도 및 FPS 설정
        const track = nextStream.getVideoTracks()[0];

        await configureCamera(track);

        if (cancelled) return;

        // 3. 비디오 연결
        const video = videoRef.current;

        if (!video) {
          nextStream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = nextStream;
        attachedVideo = video;

        video.srcObject = nextStream;

        await video.play();

        // if (cancelled) return;

        // const settings = track.getSettings();

        // alert(
        //   `해상도: ${settings.width} × ${settings.height}\n` +
        //     `설정 FPS: ${settings.frameRate}`,
        // );
      } catch (error) {
        if (!cancelled) {
          console.error("카메라 실행 실패:", error);
        }

        stream?.getTracks().forEach((track) => track.stop());
        streamRef.current = null;

        if (attachedVideo) {
          attachedVideo.srcObject = null;
        }
      }
    };

    void start();

    // 카메라 정리
    return () => {
      cancelled = true;
      mountedRef.current = false;
      captureIdRef.current += 1;

      stream?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;

      if (attachedVideo) {
        attachedVideo.srcObject = null;
      }
    };
  }, []);

  // 촬영 상태 관리
  useEffect(() => {
    activeRef.current = active;

    if (active) {
      isCapturingRef.current = false;
    } else {
      captureIdRef.current += 1;
    }
  }, [active]);

  // 갤러리 선택
  const handleGallerySelect = (file: File) => {
    if (!activeRef.current) return;

    captureIdRef.current += 1;
    isCapturingRef.current = true;

    onImageSelect(file);
  };

  // 카메라 촬영
  const handleCapture = async () => {
    if (!active || isCapturingRef.current) return;

    const video = videoRef.current;
    const track = streamRef.current?.getVideoTracks()[0];

    if (!video || !track || track.readyState !== "live") return;
    if (!video.videoWidth || !video.videoHeight) return;

    isCapturingRef.current = true;

    const captureId = ++captureIdRef.current;

    try {
      const blob = await captureVideoFrame(video);

      if (
        !mountedRef.current ||
        !activeRef.current ||
        captureId !== captureIdRef.current
      ) {
        return;
      }

      const file = new File([blob], "barcode.jpg", {
        type: "image/jpeg",
      });

      onImageSelect(file);
    } catch (error) {
      console.error("바코드 촬영 실패:", error);

      if (
        mountedRef.current &&
        activeRef.current &&
        captureId === captureIdRef.current
      ) {
        isCapturingRef.current = false;
      }
    }
  };

  return (
    <div className="absolute inset-0" inert={!active}>
      {/* 카메라 */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* 바코드 가이드 */}
      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
        <div
          className={cn(
            "relative aspect-[2/1] w-[95%] rounded-xl",
            "-translate-y-12",
            "shadow-[0_0_0_100vmax_rgba(0,0,0,0.25)]",
          )}
        >
          <span className="absolute top-0 left-0 size-7 rounded-tl-xl border-t-[3px] border-l-[3px] border-white" />
          <span className="absolute top-0 right-0 size-7 rounded-tr-xl border-t-[3px] border-r-[3px] border-white" />
          <span className="absolute bottom-0 left-0 size-7 rounded-bl-xl border-b-[3px] border-l-[3px] border-white" />
          <span className="absolute right-0 bottom-0 size-7 rounded-br-xl border-r-[3px] border-b-[3px] border-white" />

          <p className="absolute top-full mt-5 w-full text-center text-sm font-medium text-white">
            바코드를 촬영해주세요.
          </p>
        </div>
      </div>

      {/* 하단 그라데이션 */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-linear-to-t from-black/65 via-black/20 to-transparent" />

      {/* 하단 컨트롤 */}
      <div className="px-page-x absolute inset-x-0 bottom-0 z-20 pb-[max(70px,env(safe-area-inset-bottom))]">
        <div className="relative flex items-center justify-center">
          {/* 갤러리 */}
          <div className="absolute right-[calc(50%+70px)]">
            <BookBarcodeImagePicker onImageSelect={handleGallerySelect} />
          </div>

          {/* 촬영 */}
          <button
            type="button"
            onClick={() => void handleCapture()}
            aria-label="바코드 촬영"
            className="flex size-19 items-center justify-center rounded-full border-[3px] border-white p-1.25 active:scale-95"
          >
            <span className="size-full rounded-full bg-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
