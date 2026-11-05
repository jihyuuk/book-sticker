import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";

import { useBookByIsbn } from "@/hooks/mutations/book/use-book-by-isbn";
import BookBarcodeCamera from "./book-barcode-camera";
import BookBarcodeHeader from "./book-barcode-header";
import { CircleAlert, LoaderCircle, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { BookInfoData } from "./book-scanner-modal";

type Props = {
  onBookChange: React.Dispatch<React.SetStateAction<BookInfoData>>;
  onBack: () => void;
};

type BarcodeStatus =
  | "CAMERA"
  | "ANALYZING"
  | "BARCODE_NOT_DETECTED"
  | "INVALID_BARCODE"
  | "BOOK_NOT_FOUND"
  | "API_ERROR";

const STATUS_CONTENT = {
  BARCODE_NOT_DETECTED: {
    title: "바코드 인식 실패",
    description: "바코드가 선명하게 보이도록 다시 촬영해주세요.",
  },
  INVALID_BARCODE: {
    title: "잘못된 바코드",
    description: "978 또는 979로 시작하는 13자리 바코드를 촬영해주세요.",
  },
  BOOK_NOT_FOUND: {
    title: "조회 결과 없음",
    description: "해당 바코드로 조회된 책 정보가 없어요.",
  },
  API_ERROR: {
    title: "조회 실패",
    description: "일시적인 오류가 발생했어요.\n잠시 후 다시 시도해주세요.",
  },
};

const imageReader = new BrowserMultiFormatReader();

export default function BookBarcodeScannerView({
  onBookChange,
  onBack,
}: Props) {
  const { mutateAsync: findBook } = useBookByIsbn();

  const [status, setStatus] = useState<BarcodeStatus>("CAMERA");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const imageRequestIdRef = useRef(0);

  // Object URL 정리
  useEffect(() => {
    if (!previewUrl) return;

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // 언마운트 시 진행 중인 분석 결과 무효화
  useEffect(() => {
    return () => {
      imageRequestIdRef.current += 1;
    };
  }, []);

  // 촬영 / 갤러리 파일 공통 처리
  const handleImageSelect = async (file: File) => {
    const url = URL.createObjectURL(file);
    const requestId = ++imageRequestIdRef.current;

    // 1. 이미지 표시 및 분석 상태 전환
    setPreviewUrl(url);
    setStatus("ANALYZING");

    // 2. ZXing 분석
    let isbn: string;

    try {
      const result = await imageReader.decodeFromImageUrl(url);

      if (requestId !== imageRequestIdRef.current) return;

      isbn = result.getText();
    } catch {
      if (requestId !== imageRequestIdRef.current) return;

      setStatus("BARCODE_NOT_DETECTED");
      return;
    }
    // 3. ISBN 검증
    const isIsbn =
      /^\d{13}$/.test(isbn) &&
      (isbn.startsWith("978") || isbn.startsWith("979"));

    if (!isIsbn) {
      setStatus("INVALID_BARCODE");
      return;
    }

    // 4. 책 정보 API 조회
    try {
      const result = await findBook(isbn);

      if (requestId !== imageRequestIdRef.current) return;

      if (result.status === "BOOK_NOT_FOUND") {
        setStatus("BOOK_NOT_FOUND");
        return;
      }

      // 책 정보 조회 성공
      onBookChange(result.book);
      onBack();
    } catch {
      if (requestId !== imageRequestIdRef.current) return;

      setStatus("API_ERROR");
    }
  };

  // 다시 촬영
  const handleRetry = () => {
    imageRequestIdRef.current += 1;
    setPreviewUrl(null);
    setStatus("CAMERA");
  };

  return (
    <section className="relative h-full w-full overflow-hidden bg-black">
      {/* 헤더 */}
      <BookBarcodeHeader onBack={onBack} />

      <main className="absolute inset-0 flex items-center justify-center overflow-hidden">
        {/* 카메라 촬영 */}
        <BookBarcodeCamera
          onImageSelect={handleImageSelect}
          active={status === "CAMERA"}
        />

        {/* 그 외 상태 */}
        {status !== "CAMERA" && previewUrl && (
          <div className="absolute inset-0 z-30 bg-black">
            {/* 촬영한 이미지 */}
            {previewUrl && (
              <img
                src={previewUrl}
                alt="촬영한 바코드"
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}

            {/* 이미지 어둡게 */}
            <div className="pointer-events-none absolute inset-0 bg-black/40" />
            {/* 하단 그라데이션 */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-72 bg-linear-to-t from-black/70 via-black/25 to-transparent" />

            {/* 상태별 안내 */}
            <div className="pointer-events-none absolute inset-x-0 top-16 bottom-36 flex items-center justify-center px-6 text-center text-white">
              {status === "ANALYZING" ? (
                <LoaderCircle
                  className="size-10 animate-spin"
                  strokeWidth={1.5}
                />
              ) : (
                <div className="flex max-w-sm flex-col items-center gap-3">
                  <CircleAlert className="mb-2 size-10" strokeWidth={1.5} />

                  <h2 className="text-lg font-semibold">
                    {STATUS_CONTENT[status].title}
                  </h2>

                  <p className="text-sm leading-6 font-medium whitespace-pre-line text-white/70">
                    {STATUS_CONTENT[status].description}
                  </p>
                </div>
              )}
            </div>

            {/* 하단 버튼 */}
            {status !== "ANALYZING" && (
              <div className="px-page-x absolute inset-x-0 bottom-0 z-20 w-full pb-[max(24px,env(safe-area-inset-bottom))]">
                {/* 다시 촬영 */}
                <Button
                  variant="outline"
                  onClick={handleRetry}
                  className="w-full"
                >
                  <RotateCw className="size-4" />
                  다시 촬영하기
                </Button>
              </div>
            )}
          </div>
        )}
      </main>
    </section>
  );
}
