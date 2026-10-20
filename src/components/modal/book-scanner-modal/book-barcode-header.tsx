import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

type Props = {
  onBack: () => void;
};

export default function BookBarcodeHeader({ onBack }: Props) {
  return (
    <>
      {/* 상단 그라데이션 */}
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 z-40 h-52",
          "bg-linear-to-b from-black/70 via-black/25 via-40% to-transparent",
        )}
      />

      {/* 상단 헤더 */}
      <header
        className={cn(
          "absolute inset-x-0 top-0 z-40",
          "flex h-14 items-center text-white md:h-16",
        )}
      >
        <div className="px-page-x grid w-full grid-cols-[24px_1fr_24px] items-center">
          <button type="button" onClick={onBack} aria-label="뒤로가기">
            <ArrowLeft className="size-6" strokeWidth={1.5} />
          </button>

          <div className="text-title-2 min-w-0 truncate px-2 text-center font-semibold">
            바코드 검색
          </div>
        </div>
      </header>
    </>
  );
}
