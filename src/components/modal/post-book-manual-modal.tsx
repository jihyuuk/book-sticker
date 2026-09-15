import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { ImagePlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onValueChange: (book: BookSearchResult) => void;
};

export default function PostBookManualModal({
  open,
  onOpenChange,
  onValueChange,
}: Props) {
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

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="flex max-h-[95dvh] w-[calc(100%-1rem)] max-w-xl flex-col gap-0 overflow-hidden p-0 sm:max-h-[90dvh] sm:w-[calc(100%-2rem)]"
      >
        <DialogHeader className="shrink-0 px-4 py-4">
          <DialogTitle>직접 입력</DialogTitle>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="space-y-1 pb-4">
            {/* 이미지 기능은 나중에 구현 */}
            <Field className="w-full px-4 py-3">
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
          </div>
        </div>

        <div className="shrink-0 px-4 py-3">
          <Button
            type="button"
            onClick={handleManualSubmit}
            className="h-12 w-full bg-sky-500 text-base hover:bg-sky-600"
          >
            책 저장
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

import { Input } from "@/components/ui/input";
import type { BookSearchResult } from "@/api/book-api";

type Props2 = {
  label: string;
  value: string;
  placeholder: string;
  onValueChange: (value: string) => void;
};

function PostBookInputField({
  label,
  value,
  placeholder,
  onValueChange,
}: Props2) {
  return (
    <Field className="grid grid-cols-[64px_1fr] items-center gap-3 px-4 py-2">
      <FieldLabel className="text-sm font-semibold">{label}</FieldLabel>

      <Input
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        placeholder={placeholder}
        className="h-11"
      />
    </Field>
  );
}
