import { useState } from "react";
import { Field, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

import type { BookInfoData } from "../book/book-info";
import BookInfo from "../book/book-info";
import BookScannerModal from "../modal/book-scanner-modal/book-scanner-modal";

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
        <FieldLabel className="text-sm font-semibold">책</FieldLabel>

        {value && !disabled && (
          <button
            type="button"
            className="text-sm font-medium text-sky-500"
            onClick={() => setOpen(true)}
          >
            다른 책 선택
          </button>
        )}
      </div>

      {value ? (
        <BookInfo book={value} />
      ) : (
        <Button
          type="button"
          variant="outline"
          className="h-20 w-full gap-2"
          onClick={() => setOpen(true)}
          disabled={disabled}
        >
          <BookOpen className="size-6 text-sky-500" strokeWidth={1.5} />
          <span className="text-sm font-medium">책 조회하기</span>
        </Button>
      )}

      <BookScannerModal
        open={open}
        onOpenChange={setOpen}
        onValueChange={onValueChange}
      />
    </Field>
  );
}
