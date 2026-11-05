import { LoaderCircle, Plus, X } from "lucide-react";

import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "cn";
import type { BookInfoData, BookModalView } from "./book-scanner-modal";
import { useCoverPreviewUrl } from "@/hooks/utils/use-cover-preview-url";
import { useRef } from "react";
import { useOpenImageViewer } from "@/store/image-viewer-store";

type Props = {
  book: BookInfoData;
  onBookChange: React.Dispatch<React.SetStateAction<BookInfoData>>;
  onBack: () => void;
  onChangeView: (view: BookModalView) => void;
  coverImageFile: File | null;
  onCoverSelect: (file: File) => void;
  onCoverRemove: () => void;
  isCoverOptimizing: boolean;
};

export default function BookManualInputView({
  book,
  onBookChange,
  onBack,
  onChangeView,
  coverImageFile,
  onCoverSelect,
  onCoverRemove,
  isCoverOptimizing,
}: Props) {
  const openImageViewer = useOpenImageViewer();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const previewUrl = useCoverPreviewUrl(coverImageFile);
  const coverSrc = previewUrl ?? book.coverUrl;

  return (
    <section className="flex min-h-0 flex-1 flex-col bg-white">
      {/* 헤더 */}
      <header className="z-50 flex h-14 shrink-0 items-center justify-center bg-white md:h-16">
        <div className="px-page-x grid w-full max-w-2xl grid-cols-[1fr_auto_1fr] items-center">
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
            className="text-end text-sky-600"
          >
            바코드 촬영
            {/* <ScanBarcode className="size-6 text-sky-600" strokeWidth={1.5} /> */}
          </button>
        </div>
      </header>

      {/* 입력 영역 */}
      <div className="px-page-x min-h-0 flex-1 space-y-4 overflow-y-auto pb-24">
        {/* 책 표지 */}
        <Field>
          <FieldLabel>
            책 표지 <span className="text-destructive">*</span>
          </FieldLabel>

          <div className="relative aspect-20/29 w-16! shrink-0">
            {coverSrc ? (
              <>
                {/* 책 표지 */}
                <button
                  type="button"
                  onClick={() =>
                    openImageViewer({
                      images: [coverSrc],
                    })
                  }
                  className="absolute inset-0 overflow-hidden rounded-md border bg-gray-100"
                  aria-label="책 표지 확대하기"
                >
                  <img
                    src={coverSrc}
                    alt={book.title || "책 표지"}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </button>

                {/* 표지 삭제 */}
                <button
                  type="button"
                  disabled={isCoverOptimizing}
                  onClick={onCoverRemove}
                  aria-label="책 표지 삭제"
                  className="absolute -top-2 -right-2 z-20 flex size-6 items-center justify-center rounded-full bg-black text-white disabled:opacity-50"
                >
                  <X className="size-4" strokeWidth={1.5} />
                </button>
              </>
            ) : (
              /* 표지 추가 */
              <button
                type="button"
                disabled={isCoverOptimizing}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "text-muted-foreground flex size-full flex-col items-center justify-center gap-1 rounded-md border border-dashed bg-gray-100",
                  "hover:border-primary hover:text-primary transition-colors hover:bg-sky-50",
                  "active:bg-sky-100",
                )}
                aria-label="책 표지 추가"
              >
                <Plus className="size-5" strokeWidth={1.5} />
              </button>
            )}

            {/* 이미지 최적화 중 로딩 오버레이 */}
            {isCoverOptimizing && (
              <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-md bg-black/30">
                <LoaderCircle className="size-6 animate-spin text-white" />
              </div>
            )}
          </div>

          {/* 실제 파일 선택 input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];

              if (file) {
                onCoverSelect(file);
              }

              e.currentTarget.value = "";
            }}
          />
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
          label="출판사"
          value={book.publisher ?? ""}
          placeholder="출판사를 입력해주세요"
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
          inputMode="text"
          onValueChange={(value) =>
            onBookChange((prev) => ({
              ...prev,
              isbn: value
                .replace(/[^0-9xX]/g, "")
                .toUpperCase()
                .slice(0, 13),
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
        size="md"
        value={value}
        inputMode={inputMode}
        placeholder={placeholder}
        onChange={(e) => onValueChange(e.target.value)}
      />
    </Field>
  );
}
