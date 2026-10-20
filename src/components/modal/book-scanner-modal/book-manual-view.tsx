import { Plus, ScanBarcode, X } from "lucide-react";

import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "cn";
import type { BookModalView } from "./book-scanner-modal";
import type { BookInfoData } from "@/components/book/book-info";

type Props = {
  book: BookInfoData;
  onBookChange: React.Dispatch<React.SetStateAction<BookInfoData>>;
  onBack: () => void;
  onChangeView: (view: BookModalView) => void;
};

export default function BookManualInputView({
  book,
  onBookChange,
  onBack,
  onChangeView,
}: Props) {
  return (
    <section className="h-full bg-white">
      {/* 헤더 */}
      <header className="sticky top-0 z-50 flex h-14 items-center justify-center bg-white md:h-16">
        <div className="px-page-x grid w-full max-w-2xl grid-cols-[24px_1fr_24px] items-center">
          <button type="button" onClick={onBack} aria-label="모달 닫기">
            <X className="size-6" strokeWidth={1.5} />
          </button>

          <div className="text-title-2 min-w-0 truncate px-2 text-center font-semibold">
            책 정보
          </div>

          <button
            type="button"
            onClick={() => onChangeView("SCANNER")}
            aria-label="바코드 검색"
          >
            <ScanBarcode className="size-6 text-sky-600" strokeWidth={1.5} />
          </button>
        </div>
      </header>

      {/* 입력 영역 */}
      <div className="px-page-x space-y-4 pb-4">
        {/* 표지 기능은 나중에 구현 */}
        <Field>
          <FieldLabel>
            책 표지 <span className="text-destructive">*</span>
          </FieldLabel>

          {book.cover_url && (
            <img
              src={book.cover_url}
              alt={book.title}
              className="aspect-20/29 h-25 w-auto! self-start rounded-md object-contain"
            />
          )}

          {!book.cover_url && (
            <button
              type="button"
              className={cn(
                "text-muted-foreground flex aspect-20/29 h-25 w-auto! flex-col items-center justify-center gap-1 self-start rounded-md border border-dashed bg-gray-100 disabled:opacity-50",
                "hover:border-primary hover:text-primary transition-colors hover:bg-sky-50",
                "active:bg-sky-100",
              )}
            >
              <Plus className="size-5" strokeWidth={1.5} />
            </button>
          )}

          {/* <div>
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
          </div> */}
        </Field>

        <BookInputField
          label="책 이름"
          value={book.title}
          placeholder="책 이름을 입력해주세요"
          onValueChange={(value) =>
            onBookChange((prev) => ({
              ...prev,
              title: value,
            }))
          }
          isRequired
        />

        <BookInputField
          label="저자"
          value={book.author ?? ""}
          placeholder="저자를 입력해주세요"
          onValueChange={(value) =>
            onBookChange((prev) => ({
              ...prev,
              author: value,
            }))
          }
          isRequired
        />

        <BookInputField
          label="발행처"
          value={book.publisher ?? ""}
          placeholder="발행처를 입력해주세요"
          onValueChange={(value) =>
            onBookChange((prev) => ({
              ...prev,
              publisher: value,
            }))
          }
        />

        <BookInputField
          label="ISBN"
          value={book.isbn ?? ""}
          placeholder="ISBN을 입력해주세요"
          inputMode="numeric"
          onValueChange={(value) =>
            onBookChange((prev) => ({
              ...prev,
              isbn: value,
            }))
          }
        />
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
  isRequired?: boolean;
};

export function BookInputField({
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
        size="lg"
        value={value}
        inputMode={inputMode}
        placeholder={placeholder}
        onChange={(e) => onValueChange(e.target.value)}
      />
    </Field>
  );
}
