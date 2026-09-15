import { useBookByIsbn } from "@/hooks/mutations/use-book-by-isbn";
import BookInfo from "@/components/book/book-info";
import { useState } from "react";

export default function BookTestPage() {
  const [isbn, setIsbn] = useState("");

  const { mutate, data, isPending, error } = useBookByIsbn();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const value = isbn.trim();
    if (!value) return;

    mutate(value);
    setIsbn("");
  };

  return (
    <div className="p-10">
      <form onSubmit={handleSubmit}>
        <input
          value={isbn}
          onChange={(e) => setIsbn(e.target.value)}
          placeholder="ISBN 입력"
          className="border p-2"
        />

        <button type="submit" disabled={isPending} className="ml-2 border p-2">
          {isPending ? "조회 중..." : "조회"}
        </button>
      </form>

      {data?.book && (
        <div className="mt-5 max-w-md border">
          <BookInfo book={data.book} />
        </div>
      )}

      {data?.status === "BOOK_NOT_FOUND" && (
        <p className="mt-5">검색 결과가 없습니다.</p>
      )}

      {data?.status === "FOUND_WITHOUT_COVER" && (
        <p className="mt-2 text-sm text-gray-500">
          책은 찾았지만 표지 이미지가 없습니다.
        </p>
      )}

      {error && <p className="mt-5 text-red-500">{error.message}</p>}
    </div>
  );
}
