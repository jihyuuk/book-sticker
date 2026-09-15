export type BookInfoData = {
  isbn: string | null;
  title: string;
  author: string | null;
  publisher: string | null;
  cover_url: string | null;
};

type Props = {
  book: BookInfoData;
};

export default function BookInfo({ book }: Props) {
  return (
    <div className="flex items-start gap-3 px-4 py-4">
      <div className="aspect-[20/29] w-16 shrink-0 overflow-hidden rounded-md bg-gray-100">
        {book.cover_url && (
          <img
            src={book.cover_url}
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
  );
}
