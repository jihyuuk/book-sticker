import { cn } from "@/lib/utils";

export type BookInfoData = {
  isbn: string | null;
  title: string;
  author: string | null;
  publisher: string | null;
  cover_url: string | null;
};

type Props = {
  book: BookInfoData;
  className?: string;
};

export default function BookInfo({ book, className }: Props) {
  return (
    <div className={cn("flex gap-3", className)}>
      <div className="aspect-[20/29] h-18 shrink-0 overflow-hidden rounded-md bg-gray-100">
        {book.cover_url && (
          <img
            src={book.cover_url}
            alt={book.title}
            className="h-full w-full object-cover"
          />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="grid grid-cols-[48px_1fr] text-xs">
          <span className="col-span-2 mb-1 truncate text-sm font-semibold text-gray-600">
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
  );
}
