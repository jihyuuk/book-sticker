import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { BookSearchResult } from "@/api/book-api";
import PostBookManualTab from "./post-book-maual-tab";
import PostBookIsbnTab from "./post-book-isbn-tab";
import { POST_BOOK_TAB } from "@/lib/constants";
import PostSelectedBook from "./post-selected-book";

type Props = {
  value: BookSearchResult | null;
  onValueChange: (book: BookSearchResult | null) => void;
  disabled?: boolean;
};

export default function PostBookField({ value, onValueChange }: Props) {
  if (value) {
    return <PostSelectedBook value={value} onValueChange={onValueChange} />;
  }

  return (
    <section className="px-4 py-5">
      <div className="mb-2">
        <h2 className="text-sm font-semibold">책 조회하기</h2>
      </div>

      <Tabs defaultValue={POST_BOOK_TAB.MANUAL}>
        {/* 입력 방식 */}
        <TabsList className="mb-5 grid !h-12 w-full grid-cols-2">
          <TabsTrigger value={POST_BOOK_TAB.ISBN} className="h-full">
            ISBN으로 찾기
          </TabsTrigger>

          <TabsTrigger value={POST_BOOK_TAB.MANUAL} className="h-full">
            직접 입력
          </TabsTrigger>
        </TabsList>

        {/* ISBN 검색 */}
        <PostBookIsbnTab onValueChange={onValueChange} />

        {/* 직접 입력 */}
        <PostBookManualTab onValueChange={onValueChange} />
      </Tabs>
    </section>
  );
}
