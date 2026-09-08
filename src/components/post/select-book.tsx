import type { BookSearchResult } from "@/api/book-api";
import { useBookSearch } from "@/hooks/queries/use-book-search";
import { BookOpenIcon, SearchIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

type Props = {
  selectedBook: BookSearchResult | null;
  onSelectBook: (book: BookSearchResult | null) => void;
};

export default function SelectBook({ selectedBook, onSelectBook }: Props) {
  const [bookSearchInput, setBookSearchInput] = useState("");
  const [bookSearchKeyword, setBookSearchKeyword] = useState("");

  const { data: books = [], isFetching } = useBookSearch(bookSearchKeyword);

  const handleSearch = () => {
    const keyword = bookSearchInput.trim();

    if (!keyword || isFetching) return;

    setBookSearchKeyword(keyword);
    onSelectBook(null);
  };

  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm">
      {/* 제목 */}
      <div className="mb-3 flex items-center justify-between">
        <label className="text-base font-bold text-gray-700">책</label>

        <span className="text-xs text-gray-400">국립중앙도서관 OpenAPI</span>
      </div>

      {/* 검색 */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <SearchIcon className="absolute top-1/2 left-4 size-5 -translate-y-1/2 text-gray-400" />

          <Input
            value={bookSearchInput}
            onChange={(e) => setBookSearchInput(e.target.value)}
            placeholder="책 제목을 검색해주세요"
            className="h-14 rounded-xl border-2 pl-11 text-base"
            disabled={isFetching}
          />
        </div>

        <Button
          type="button"
          className="h-14 rounded-xl px-5 font-bold"
          onClick={handleSearch}
          disabled={!bookSearchInput.trim() || isFetching}
        >
          {isFetching ? "검색 중" : "검색"}
        </Button>
      </div>

      {/* 검색 전 */}
      {!bookSearchKeyword && (
        <div className="mt-5 flex min-h-36 flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 px-4 text-center">
          <BookOpenIcon className="mb-3 size-8 text-gray-300" />

          <p className="text-sm font-medium text-gray-500">
            읽은 책을 검색해주세요
          </p>

          <p className="mt-1 text-xs text-gray-400">
            검색 결과에서 책을 선택할 수 있어요.
          </p>
        </div>
      )}

      {/* 검색 중 */}
      {isFetching && bookSearchKeyword && (
        <div className="py-8 text-center text-sm text-gray-400">
          책을 검색하고 있어요...
        </div>
      )}

      {/* 검색 결과 없음 */}
      {!isFetching && bookSearchKeyword && books.length === 0 && (
        <div className="mt-5 flex min-h-32 flex-col items-center justify-center rounded-xl bg-gray-50 text-center">
          <p className="text-sm font-medium text-gray-500">
            검색 결과가 없습니다.
          </p>

          <p className="mt-1 text-xs text-gray-400">
            책 제목을 다시 확인해주세요.
          </p>
        </div>
      )}

      {/* 검색 결과 */}
      {!isFetching && books.length > 0 && (
        <div className="mt-4 space-y-2">
          {books.map((book, index) => {
            const description =
              [book.author, book.publisher].filter(Boolean).join(" · ") ||
              "상세 정보 없음";

            const isSelected =
              selectedBook?.isbn === book.isbn &&
              selectedBook?.title === book.title;

            return (
              <button
                key={
                  book.isbn ?? `${book.title}-${book.publisher ?? ""}-${index}`
                }
                type="button"
                onClick={() => onSelectBook(book)}
                className={`w-full rounded-xl border-2 p-4 text-left transition-colors ${
                  isSelected
                    ? "border-sky-400 bg-sky-50"
                    : "border-gray-200 hover:border-sky-300 hover:bg-sky-50"
                }`}
              >
                <p className="font-bold text-gray-800">{book.title}</p>

                <p className="mt-1 text-sm text-gray-500">{description}</p>
              </button>
            );
          })}
        </div>
      )}

      {/* 직접 입력 */}
      <div className="mt-4 text-center">
        <button
          type="button"
          className="text-sm font-semibold text-sky-500 hover:text-sky-600"
        >
          찾는 책이 없나요? 직접 입력하기
        </button>
      </div>
    </section>
  );
}
