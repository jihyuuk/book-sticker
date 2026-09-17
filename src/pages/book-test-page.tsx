import { useState } from "react";

import BookInfo, { type BookInfoData } from "@/components/book/book-info";
import BookScannerModal from "@/components/modal/book-scanner-modal/book-scanner-modal";

export default function BookTestPage() {
  const [open, setOpen] = useState(true);
  const [book, setBook] = useState<BookInfoData | null>(null);

  return (
    <div className="p-10">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="border p-2"
      >
        책 조회
      </button>

      {book && (
        <div className="mt-5 max-w-md border">
          <BookInfo book={book} />
        </div>
      )}

      <BookScannerModal
        open={open}
        onOpenChange={setOpen}
        onValueChange={setBook}
      />
    </div>
  );
}
