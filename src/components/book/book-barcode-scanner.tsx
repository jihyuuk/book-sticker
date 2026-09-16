import { useEffect, useRef } from "react";
import {
  BrowserMultiFormatOneDReader,
  type IScannerControls,
} from "@zxing/browser";

type Props = {
  active: boolean;
  onDetected: (value: string) => void;
};

export default function BookBarcodeScanner({ active, onDetected }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const onDetectedRef = useRef(onDetected);

  useEffect(() => {
    onDetectedRef.current = onDetected;
  }, [onDetected]);

  useEffect(() => {
    if (!active) return;

    let stream: MediaStream | null = null;
    let controls: IScannerControls | null = null;
    let cancelled = false;

    const start = async () => {
      try {
        // 1. 우리가 직접 카메라 실행
        const nextStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: {
              ideal: "environment",
            },
          },
          audio: false,
        });

        // effect가 이미 cleanup 된 경우
        if (cancelled) {
          nextStream.getTracks().forEach((track) => track.stop());
          return;
        }

        stream = nextStream;

        const video = videoRef.current;

        if (!video) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        // 2. video에 카메라 연결
        video.srcObject = stream;

        await video.play();

        if (cancelled) return;

        // 3. ZXing은 이미 실행 중인 video만 분석
        const reader = new BrowserMultiFormatOneDReader();

        const nextControls = await reader.decodeFromVideoElement(
          video,
          (result) => {
            if (!result) return;

            onDetectedRef.current(result.getText());
          },
        );

        if (cancelled) {
          nextControls.stop();
          return;
        }

        controls = nextControls;
      } catch (error) {
        if (!cancelled) {
          console.error("카메라/바코드 스캐너 실행 실패:", error);
        }
      }
    };

    start();

    return () => {
      cancelled = true;

      // ZXing 분석 중지
      controls?.stop();

      // 카메라 종료
      stream?.getTracks().forEach((track) => track.stop());

      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [active]);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted
      className="absolute inset-0 h-full w-full object-cover"
    />
  );
}
