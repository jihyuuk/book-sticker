import type { BookSearchResult } from "@/api/book-api";
import PostSelectedBook from "./post-selected-book";
import { useState } from "react";
import { Field, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Barcode, PencilLine } from "lucide-react";
import PostBookManualModal from "./post-book-manual-modal";

type Props = {
  value: BookSearchResult | null;
  onValueChange: (book: BookSearchResult | null) => void;
  disabled?: boolean;
};

export default function PostBookField({
  value,
  onValueChange,
  disabled,
}: Props) {
  const [open, setOpen] = useState(false);

  if (value) {
    return (
      <PostSelectedBook
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
      />
    );
  }

  return (
    <Field className="w-full px-4 py-5">
      <FieldLabel className="text-sm font-semibold">읽은 책</FieldLabel>

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

      <PostBookManualModal
        open={open}
        onOpenChange={setOpen}
        onValueChange={onValueChange}
      />
    </Field>
  );
}
