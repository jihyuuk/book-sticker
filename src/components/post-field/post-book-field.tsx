import { useState } from "react";
import { Field, FieldLabel } from "@/components/ui/field";
import { ChevronRight } from "lucide-react";

import type { BookInfoData } from "../book/book-info";
import BookInfo from "../book/book-info";
import BookScannerModal from "../modal/book-scanner-modal/book-scanner-modal";
import { cn } from "cn";

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
    <Field className="w-full">
      <div className="flex items-center justify-between">
        <FieldLabel>책</FieldLabel>

        {value && !disabled && (
          <button
            type="button"
            className="text-sm font-medium text-sky-500"
            onClick={() => setOpen(true)}
          >
            책 변경
          </button>
        )}
      </div>

      {value ? (
        <BookInfo book={value} />
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={cn(
            "flex h-12 w-full items-center gap-3 rounded-[6px] border border-transparent bg-gray-100 px-4 text-left",
            "hover:border-primary transition-colors hover:bg-sky-50",
            "active:bg-sky-100",
          )}
        >
          <div className="text-muted-foreground min-w-0 flex-1">
            <p className="text-body-2">책 정보를 입력해 주세요</p>
          </div>

          <ChevronRight
            className="text-muted-foreground size-5 shrink-0"
            strokeWidth={1.5}
          />
        </button>
      )}

      <BookScannerModal
        open={open}
        onOpenChange={setOpen}
        onValueChange={onValueChange}
      />
    </Field>
  );
}
