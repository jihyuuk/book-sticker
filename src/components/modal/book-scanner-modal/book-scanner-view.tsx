import { useCallback, useRef } from "react";
import { ImageIcon, PencilLine, Plus, Search, X } from "lucide-react";
import { toast } from "sonner";

import BookBarcodeScanner from "@/components/book/book-barcode-scanner";
import { useBookByIsbn } from "@/hooks/mutations/use-book-by-isbn";
import type { BookInfoData } from "@/components/book/book-info";

type Props = {
  onClose: () => void;
  onSearchIsbn: () => void;
  onManualInput: () => void;
  onFound: (book: BookInfoData) => void;
};

export default function BookScannerView({
  onClose,
  onSearchIsbn,
  onManualInput,
  onFound,
}: Props) {
  const { mutate: findBook, isPending } = useBookByIsbn();

  const lastToastAtRef = useRef(0);
  const isScanningLockedRef = useRef(false);
  const lastLookupIsbnRef = useRef<string | null>(null);

  const handleDetected = useCallback(
    (value: string) => {
      // 1. 현재 API 조회 중이면 모든 감지 무시
      if (isScanningLockedRef.current) {
        return;
      }

      //10자리 isbn 대응도 고려 해봐야함
      const isIsbn =
        /^\d{13}$/.test(value) &&
        (value.startsWith("978") || value.startsWith("979"));

      // 2. ISBN이 아닌 경우
      if (!isIsbn) {
        const now = Date.now();

        if (now - lastToastAtRef.current < 1000) {
          return;
        }

        lastToastAtRef.current = now;

        toast.warning("ISBN 바코드가 아니에요.", {
          description: `인식된 바코드: ${value}`,
        });

        return;
      }

      // 3. 방금 조회했던 동일한 ISBN이면 다시 호출하지 않음
      if (lastLookupIsbnRef.current === value) {
        toast("다른 바코드를 인식해주세요.");
        return;
      }

      // 4. API 호출 전에 즉시 잠금
      isScanningLockedRef.current = true;
      lastLookupIsbnRef.current = value;

      findBook(value, {
        onSuccess: (result) => {
          if (result.status === "BOOK_NOT_FOUND") {
            toast.error("책 정보를 찾을 수 없어요.", {
              description: `ISBN: ${value}`,
            });

            return;
          }

          // FOUND / FOUND_WITHOUT_COVER
          onFound(result.book);
        },

        onError: () => {
          toast.error("책 정보를 조회하지 못했어요.", {
            description: "잠시 후 다시 시도해주세요.",
          });

          isScanningLockedRef.current = false;

          // 서버 오류는 재시도할 수도 있으므로
          // 동일 ISBN을 다시 조회 가능하게 풀어줌
          lastLookupIsbnRef.current = null;
        },
      });
    },
    [findBook, onFound],
  );
  return (
    <section className="relative flex h-full min-h-0 flex-col bg-neutral-950 text-white">
      {/* 헤더 */}
      <header className="relative z-20 flex h-14 shrink-0 items-center justify-center bg-slate-900 px-4">
        <button
          type="button"
          onClick={onClose}
          className="absolute left-4 flex size-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/15"
          aria-label="닫기"
        >
          <X className="size-5" />
        </button>

        <h1 className="text-lg font-semibold">책 조회하기</h1>
      </header>

      {/* 카메라 영역 */}
      <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden">
        <BookBarcodeScanner active={!isPending} onDetected={handleDetected} />

        {/* 스캔 가이드 */}
        <div className="pointer-events-none relative z-10 w-full px-8">
          <div className="mx-auto flex aspect-[2.4/1] max-w-sm items-center justify-center rounded-xl border-2 border-white/80">
            <Plus className="size-12 text-white/30" strokeWidth={1} />
          </div>

          <p className="mt-5 text-center text-sm text-white/80">
            책 뒷면의 바코드를 화면 안에 맞춰주세요
          </p>
        </div>

        {/* 조회 중 */}
        {isPending && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 backdrop-blur-[2px]">
            <div className="text-center">
              <div className="mx-auto size-8 animate-spin rounded-full border-2 border-white/30 border-t-white" />

              <p className="mt-3 text-sm font-medium">
                책 정보를 찾고 있어요...
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 보조 기능 */}
      <div className="relative z-20 shrink-0 bg-slate-900 px-6 pt-4 pb-[max(28px,env(safe-area-inset-bottom))]">
        <div className="mx-auto flex max-w-sm items-start justify-around">
          <button
            type="button"
            className="flex w-20 flex-col items-center gap-2"
          >
            <span className="flex size-12 items-center justify-center rounded-full bg-white/15">
              <ImageIcon className="size-5" />
            </span>

            <span className="text-xs text-white/80">사진첩</span>
          </button>

          <button
            type="button"
            onClick={onSearchIsbn}
            className="flex w-20 flex-col items-center gap-2"
          >
            <span className="flex size-12 items-center justify-center rounded-full bg-white/15">
              <Search className="size-5" />
            </span>

            <span className="text-xs text-white/80">ISBN 검색</span>
          </button>

          <button
            type="button"
            onClick={onManualInput}
            className="flex w-20 flex-col items-center gap-2"
          >
            <span className="flex size-12 items-center justify-center rounded-full bg-white/15">
              <PencilLine className="size-5" />
            </span>

            <span className="text-xs text-white/80">직접 입력</span>
          </button>
        </div>
      </div>
    </section>
  );
}
