import type { BookSearchResult } from "@/api/book-api";

type Props = {
  value: BookSearchResult;
  onValueChange: (n: null) => void;
  disabled?: boolean;
};

export default function PostSelectedBook({
  value: book,
  onValueChange: onBookChange,
  disabled,
}: Props) {
  return (
    <section className="px-4 py-5">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-semibold">책 정보</h2>

        <button
          type="button"
          className="text-sm font-medium text-sky-500"
          onClick={() => onBookChange(null)}
          disabled={disabled}
        >
          다른 책 선택
        </button>
      </div>

      <div className="flex items-start gap-3 px-4 py-4">
        <div className="aspect-[20/29] w-16 shrink-0 overflow-hidden rounded-md bg-gray-100">
          {book.coverUrl && (
            <img
              src={book.coverUrl ?? ""}
              alt={book.title}
              className="h-full w-full object-contain"
            />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="grid grid-cols-[48px_1fr] text-sm">
            <span className="col-span-2 mb-1 truncate text-base font-semibold text-gray-600">
              {book.title}
            </span>

            <span className="text-gray-400">저자</span>
            <span className="truncate text-gray-600">{book.author ?? "-"}</span>

            <span className="text-gray-400">발행처</span>
            <span className="truncate text-gray-600">
              {book.publisher ?? "-"}
            </span>

            <span className="text-gray-400">ISBN</span>
            <span className="truncate text-gray-600">{book.isbn ?? "-"}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
