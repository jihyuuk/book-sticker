import { ArrowLeft } from "lucide-react";

import BookInfo, { type BookInfoData } from "@/components/book/book-info";
import { Button } from "@/components/ui/button";

type Props = {
  book: BookInfoData;
  onBack: () => void;
  onConfirm: () => void;
};

export default function BookResultView({ book, onBack, onConfirm }: Props) {
  return (
    <div className="flex h-full min-h-0 flex-col bg-white">
      {/* 헤더 */}
      <header className="relative flex h-14 shrink-0 items-center justify-center border-b px-4">
        <button
          type="button"
          onClick={onBack}
          className="absolute left-3 flex size-10 items-center justify-center rounded-full transition hover:bg-gray-100"
          aria-label="뒤로가기"
        >
          <ArrowLeft className="size-5" />
        </button>

        <h1 className="text-lg font-semibold">조회 결과</h1>
      </header>

      {/* 내용 */}
      <main className="min-h-0 flex-1 overflow-y-auto px-4 py-6">
        <p className="mb-3 text-sm font-medium text-gray-500">
          찾은 책이 맞는지 확인해주세요.
        </p>

        <div className="rounded-xl border bg-white">
          <BookInfo book={book} />
        </div>
      </main>

      {/* 하단 버튼 */}
      <footer className="shrink-0 border-t bg-white px-4 pt-3 pb-[max(16px,env(safe-area-inset-bottom))]">
        <Button
          type="button"
          onClick={onConfirm}
          className="h-12 w-full bg-sky-500 text-base hover:bg-sky-600"
        >
          이 책으로 선택
        </Button>
      </footer>
    </div>
  );
}
