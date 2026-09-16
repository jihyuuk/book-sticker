import { Barcode, ImageIcon, PencilLine, Search, X } from "lucide-react";

import { Dialog, DialogContent } from "@/components/ui/dialog";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function BookScannerModal({ open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="h-dvh w-screen max-w-none gap-0 overflow-hidden rounded-none border-0 p-0 sm:h-[90dvh] sm:max-h-[760px] sm:max-w-lg sm:rounded-2xl"
      >
        <section className="relative flex h-full min-h-0 flex-col bg-neutral-950 text-white">
          {/* 헤더 */}
          <header className="relative z-20 flex h-14 shrink-0 items-center justify-center bg-sky-500 px-4">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="absolute left-4 flex size-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/15"
              aria-label="닫기"
            >
              <X className="size-5" />
            </button>

            <h1 className="text-lg font-semibold">책 조회하기</h1>
          </header>

          {/* 카메라 영역 */}
          <div className="relative flex min-h-0 flex-1 items-center justify-center">
            {/* 실제 구현 시 이 부분을 video로 교체 */}
            <div className="absolute inset-0 bg-neutral-900" />

            {/* 스캔 영역 */}
            <div className="relative z-10 w-full px-8">
              <div className="mx-auto flex aspect-[2.4/1] max-w-sm items-center justify-center rounded-xl border-2 border-white/80">
                <Barcode className="size-12 text-white/30" strokeWidth={1} />
              </div>

              <p className="mt-5 text-center text-sm text-white/80">
                책 뒷면의 바코드를 화면 안에 맞춰주세요
              </p>
            </div>
          </div>

          {/* 보조 기능 */}
          <div className="relative z-20 shrink-0 bg-sky-500 px-6 pt-4 pb-[max(28px,env(safe-area-inset-bottom))]">
            <div className="mx-auto flex max-w-sm items-start justify-around">
              {/* 사진첩 */}
              <button
                type="button"
                className="flex w-20 flex-col items-center gap-2"
              >
                <span className="flex size-12 items-center justify-center rounded-full bg-white/15 backdrop-blur transition hover:bg-white/20 active:scale-95">
                  <ImageIcon className="size-5" />
                </span>

                <span className="text-xs text-white/80">사진첩</span>
              </button>

              {/* ISBN 검색 */}
              <button
                type="button"
                className="flex w-20 flex-col items-center gap-2"
              >
                <span className="flex size-12 items-center justify-center rounded-full bg-white/15 backdrop-blur transition hover:bg-white/20 active:scale-95">
                  <Search className="size-5" />
                </span>

                <span className="text-xs text-white/80">ISBN 검색</span>
              </button>

              {/* 직접 입력 */}
              <button
                type="button"
                className="flex w-20 flex-col items-center gap-2"
              >
                <span className="flex size-12 items-center justify-center rounded-full bg-white/15 backdrop-blur transition hover:bg-white/20 active:scale-95">
                  <PencilLine className="size-5" />
                </span>

                <span className="text-xs text-white/80">직접 입력</span>
              </button>
            </div>
          </div>
        </section>
      </DialogContent>
    </Dialog>
  );
}
