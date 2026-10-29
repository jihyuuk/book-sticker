import { useState } from "react";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { ChevronRight } from "lucide-react";
import BookInfo from "../book/book-info";
import BookScannerModal from "../modal/book-scanner-modal/book-scanner-modal";
import { cn } from "cn";
import type { CreatePostParam } from "@/api/post-api";
import { useCoverPreviewUrl } from "@/hooks/utils/use-cover-preview-url";

type Props = {
  value: CreatePostParam["book"] | null;
  onValueChange: (book: CreatePostParam["book"] | null) => void;
  disabled?: boolean;
  error?: boolean;
  isUpdate?: boolean;
};

export default function PostBookField({
  value,
  onValueChange,
  disabled,
  error,
  isUpdate,
}: Props) {
  const [open, setOpen] = useState(false);
  const previewUrl = useCoverPreviewUrl(value?.coverImageFile ?? null);

  return (
    <Field id="post-book" className="w-full scroll-mt-24">
      <div className="flex items-center justify-between">
        <FieldLabel>
          책{" "}
          {isUpdate && (
            <span className="text-muted-foreground text-xs font-normal">
              수정불가
            </span>
          )}
        </FieldLabel>

        {value && !disabled && !isUpdate && (
          <button
            type="button"
            className="text-sm font-medium text-sky-500"
            onClick={() => setOpen(true)}
          >
            수정하기
          </button>
        )}
      </div>

      {value ? (
        <BookInfo
          book={{
            ...value,
            coverUrl: previewUrl ?? value.coverUrl,
          }}
        />
      ) : (
        <div className="flex flex-col gap-2">
          <button
            type="button"
            disabled={disabled || isUpdate}
            aria-invalid={error}
            onClick={() => setOpen(true)}
            className={cn(
              "flex h-12 w-full items-center gap-3 rounded-[6px] border border-transparent bg-gray-100 px-4 text-left",
              "hover:border-primary transition-colors hover:bg-sky-50",
              "active:bg-sky-100",
              error && "border-destructive",
            )}
          >
            <div className="text-muted-foreground min-w-0 flex-1">
              <p className="text-body-2">무슨 책을 읽었나요?</p>
            </div>

            <ChevronRight
              className="text-muted-foreground size-5 shrink-0"
              strokeWidth={1.5}
            />
          </button>

          {error && <FieldError>책 정보를 입력해 주세요.</FieldError>}
        </div>
      )}

      <BookScannerModal
        open={open}
        onOpenChange={setOpen}
        book={value}
        onBookChange={onValueChange}
      />
    </Field>
  );
}

// 바코드 인식 로직 수정
// 이미지 피커 로직 수정
// 표지 로직 구현 - 외부 api | 직접 업로드
// 업데이트 함수 점검
