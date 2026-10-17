import { ArrowLeft, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { BookInfoData } from "@/components/book/book-info";
import SubHeader from "@/components/header/sub-header";
import { cn } from "cn";
import PostSubmitButton from "@/components/post-field/post-submit-button";

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
    <section className="h-full bg-white">
      {/* 헤더 */}
      <header className="px-page-x flex h-14 items-center justify-start">
        <button type="button" onClick={onBack} aria-label="이전">
          <ArrowLeft className="size-6" strokeWidth={1.5} />
        </button>
      </header>

      {/* 헤더 */}
      {/* <header className="relative flex h-14 shrink-0 items-center justify-center px-4">
        <button
          type="button"
          onClick={onBack}
          className="absolute left-4 flex size-10 items-center justify-center rounded-full transition hover:bg-slate-100"
          aria-label="뒤로가기"
        >
          <ArrowLeft className="size-5" />
        </button>
      </header>

      <h2 className="px-page-x text-xl font-semibold">ISBN으로 책 검색</h2> */}

      {/* 입력 영역 */}
      <div className="px-page-x space-y-4 pb-4">
        {/* 표지 기능은 나중에 구현 */}
        <Field>
          <FieldLabel>
            책 표지 <span className="text-destructive">*</span>
          </FieldLabel>

          <div>
            <button
              type="button" // onClick={() => inputRef.current?.click()}
              // disabled={disabled}
              className={cn(
                "text-muted-foreground flex size-23 flex-col items-center justify-center gap-1 rounded-lg border border-dashed bg-gray-100 disabled:opacity-50",
                "hover:border-primary hover:text-primary transition-colors hover:bg-sky-50",
                "active:bg-sky-100",
              )}
            >
              <Plus className="size-5" strokeWidth={1.5} />
            </button>
          </div>
        </Field>

        <BookInputField
          label="책 이름"
          value={title}
          placeholder="책 이름을 입력해주세요"
          onValueChange={setTitle}
          isRequired
        />

        <BookInputField
          label="저자"
          value={author}
          placeholder="저자를 입력해주세요"
          onValueChange={setAuthor}
          isRequired
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

      {/* 하단 버튼 */}
      <PostSubmitButton onClick={handleSubmit}>책 입력하기</PostSubmitButton>
    </section>
  );
}

type BookInputFieldProps = {
  label: string;
  value: string;
  placeholder: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  onValueChange: (value: string) => void;
  isRequired?: boolean;
};

function BookInputField({
  label,
  value,
  placeholder,
  inputMode,
  onValueChange,
  isRequired,
}: BookInputFieldProps) {
  return (
    <Field>
      <FieldLabel>
        {label} {isRequired && <span className="text-destructive">*</span>}
      </FieldLabel>

      <Input
        value={value}
        inputMode={inputMode}
        placeholder={placeholder}
        onChange={(e) => onValueChange(e.target.value)}
      />
    </Field>
  );
}
