import { useState } from "react";
import { Field, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Barcode, PencilLine } from "lucide-react";
import PostBookManualModal from "../modal/post-book-manual-modal";
import type { BookInfoData } from "../book/book-info";
import BookInfo from "../book/book-info";

type Props = {
  value: BookInfoData | null;
  onValueChange: (book: BookInfoData | null) => void;
  disabled?: boolean;
};

export default function PostBookField({
  value,
  onValueChange,
  disabled,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Field className="w-full px-4 py-5">
      <div className="flex items-center justify-between">
        <FieldLabel className="text-sm font-semibold">읽은 책</FieldLabel>

        {value && !disabled && (
          <button
            type="button"
            className="text-sm font-medium text-sky-500"
            onClick={() => onValueChange(null)}
          >
            다른 책 선택
          </button>
        )}
      </div>

      {value ? (
        <BookInfo book={value} />
      ) : (
        <div className="grid grid-cols-2 gap-2 md:gap-3">
          <Button
            type="button"
            variant="outline"
            className="h-28 flex-col gap-2"
            disabled={disabled}
          >
            <Barcode className="size-7 text-sky-500" strokeWidth={1.5} />
            <span className="text-sm font-medium">바코드 스캔</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            className="h-28 flex-col gap-2"
            onClick={() => setOpen(true)}
            disabled={disabled}
          >
            <PencilLine className="size-7 text-sky-500" strokeWidth={1.5} />
            <span className="text-sm font-medium">직접 입력</span>
          </Button>
        </div>
      )}

      <PostBookManualModal
        open={open}
        onOpenChange={setOpen}
        onValueChange={onValueChange}
      />
    </Field>
  );
}
