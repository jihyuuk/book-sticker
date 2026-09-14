import type { BookSearchResult } from "@/api/book-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TabsContent } from "@/components/ui/tabs";
import { POST_BOOK_TAB } from "@/lib/constants";
import { Barcode, Search } from "lucide-react";

type Props = {
  onValueChange: (book: BookSearchResult) => void;
};

export default function PostBookIsbnTab({ onValueChange }: Props) {
  return (
    <TabsContent value={POST_BOOK_TAB.ISBN} className="mt-0">
      {/* 바코드 */}
      <Button
        type="button"
        variant="outline"
        className="h-30 w-full flex-col gap-2 border"
      >
        <Barcode className="size-10 text-sky-500" />
        <span className="">바코드 스캔하기</span>
      </Button>

      {/* ISBN 직접 입력 */}
      <div className="mt-5 flex gap-2">
        <Input
          placeholder="ISBN 13자리를 입력해주세요"
          className="h-12 flex-1 px-4 text-sm"
        />

        <Button
          type="button"
          className="h-12 shrink-0 bg-sky-500 px-5 hover:bg-sky-600"
        >
          <Search className="size-4" />
          검색
        </Button>
      </div>
    </TabsContent>
  );
}
