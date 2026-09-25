import { ArrowLeft, ImagePlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { BookInfoData } from "@/components/book/book-info";

type Props = {
  onBack: () => void;
  onConfirm: (book: BookInfoData) => void;
};

export default function BookManualInputView({ onBack, onConfirm }: Props) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [publisher, setPublisher] = useState("");
  const [isbn, setIsbn] = useState("");

  const handleSubmit = () => {
    if (!title.trim()) {
      toast.error("책 제목은 필수입니다.");
      return;
    }

    onConfirm({
      title: title.trim(),
      author: author.trim() || null,
      publisher: publisher.trim() || null,
      isbn: isbn.trim() || null,
      cover_url: null,
    });
  };

  return (
    <section className="flex h-full min-h-0 flex-col bg-white">
      {/* 헤더 */}
      <header className="relative flex h-14 shrink-0 items-center justify-center border-b px-4">
        <button
          type="button"
          onClick={onBack}
          className="absolute left-4 flex size-10 items-center justify-center rounded-full transition hover:bg-slate-100"
          aria-label="뒤로가기"
        >
          <ArrowLeft className="size-5" />
        </button>

        <h1 className="text-lg font-semibold">직접 입력</h1>
      </header>

      {/* 입력 영역 */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="space-y-1 py-4">
          {/* 표지 기능은 나중에 구현 */}
          <Field className="w-full px-4 py-3">
            <FieldLabel className="text-sm font-semibold">책 표지</FieldLabel>

            <div className="flex">
              <button
                type="button"
                disabled
                className="flex aspect-[20/29] w-16 shrink-0 flex-col items-center justify-center gap-1 rounded-md border border-dashed bg-gray-50 text-gray-400"
              >
                <ImagePlus className="size-4" />
                <span className="text-[10px]">표지 추가</span>
              </button>
            </div>
          </Field>

          <BookInputField
            label="책 이름"
            value={title}
            placeholder="책 이름을 입력해주세요"
            onValueChange={setTitle}
          />

          <BookInputField
            label="저자"
            value={author}
            placeholder="저자를 입력해주세요"
            onValueChange={setAuthor}
          />

          <BookInputField
            label="발행처"
            value={publisher}
            placeholder="발행처를 입력해주세요"
            onValueChange={setPublisher}
          />

          <BookInputField
            label="ISBN"
            value={isbn}
            placeholder="ISBN을 입력해주세요"
            inputMode="numeric"
            onValueChange={(value) => {
              setIsbn(value.replace(/\D/g, "").slice(0, 13));
            }}
          />
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="shrink-0 px-4 py-3 pb-[max(12px,env(safe-area-inset-bottom))]">
        <Button
          type="button"
          onClick={handleSubmit}
          className="h-12 w-full bg-sky-500 text-base hover:bg-sky-600"
        >
          책 선택
        </Button>
      </div>
    </section>
  );
}

type BookInputFieldProps = {
  label: string;
  value: string;
  placeholder: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  onValueChange: (value: string) => void;
};

function BookInputField({
  label,
  value,
  placeholder,
  inputMode,
  onValueChange,
}: BookInputFieldProps) {
  return (
    <Field className="w-full px-4 py-3">
      <FieldLabel className="text-sm font-semibold">{label}</FieldLabel>

      <Input
        value={value}
        inputMode={inputMode}
        placeholder={placeholder}
        onChange={(e) => onValueChange(e.target.value)}
        className="h-12 px-4 text-sm"
      />
    </Field>
  );
}
