import type { BookSearchResult } from "@/api/book-api";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { TabsContent } from "@/components/ui/tabs";
import { POST_BOOK_TAB } from "@/lib/constants";
import { ImagePlus } from "lucide-react";
import { useState } from "react";
import PostBookInputField from "./post-book-input-field";
import { toast } from "sonner";

type Props = {
  onValueChange: (book: BookSearchResult) => void;
};

export default function PostBookManualTab({ onValueChange }: Props) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [publisher, setPublisher] = useState("");
  const [isbn, setIsbn] = useState("");

  const handleManualSubmit = () => {
    if (!title.trim()) {
      toast.error("책 제목은 필수입니다.");
      return;
    }

    onValueChange({
      title: title.trim(),
      author: author.trim() || null,
      publisher: publisher.trim() || null,
      isbn: isbn.trim() || null,
      coverUrl: "",
    });
  };

  return (
    <TabsContent value={POST_BOOK_TAB.MANUAL} className="mt-0">
      <div className="space-y-2">
        {/* 이미지 기능은 나중에 구현 */}
        <Field className="w-full px-4 py-5">
          <FieldLabel className="text-sm font-semibold">책 표지</FieldLabel>

          <div>
            <button
              type="button"
              disabled
              className="flex aspect-20/29 w-24 flex-col items-center justify-center gap-2 rounded-lg border border-dashed bg-gray-50 text-gray-400"
            >
              <ImagePlus className="size-5" />
              <span className="text-xs">표지 추가</span>
            </button>
          </div>
        </Field>

        <PostBookInputField
          label="책 이름"
          value={title}
          placeholder="책 이름을 입력해주세요"
          onValueChange={setTitle}
        />

        <PostBookInputField
          label="저자"
          value={author}
          placeholder="저자를 입력해주세요"
          onValueChange={setAuthor}
        />

        <PostBookInputField
          label="발행처"
          value={publisher}
          placeholder="발행처를 입력해주세요"
          onValueChange={setPublisher}
        />

        <PostBookInputField
          label="ISBN"
          value={isbn}
          placeholder="ISBN을 입력해주세요"
          onValueChange={setIsbn}
        />

        <div className="px-4 pt-5 pb-2">
          <Button
            type="button"
            onClick={handleManualSubmit}
            className="h-12 w-full bg-sky-500 text-base hover:bg-sky-600"
          >
            책 저장
          </Button>
        </div>
      </div>
    </TabsContent>
  );
}
