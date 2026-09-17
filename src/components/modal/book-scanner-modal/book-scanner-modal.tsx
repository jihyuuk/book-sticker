import { useEffect, useState } from "react";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { BookInfoData } from "@/components/book/book-info";
import BookScannerView from "./book-scanner-view";
import BookResultView from "./book-result-view";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onValueChange: (book: BookInfoData) => void;
};

type BookModalView = "SCANNER" | "ISBN_SEARCH" | "MANUAL_INPUT" | "RESULT";

export default function BookScannerModal({
  open,
  onOpenChange,
  onValueChange,
}: Props) {
  const [view, setView] = useState<BookModalView>("SCANNER");
  const [foundBook, setFoundBook] = useState<BookInfoData | null>(null);

  const handleFound = (book: BookInfoData) => {
    setFoundBook(book);
    setView("RESULT");
  };

  const handleSelectBook = (book: BookInfoData) => {
    onValueChange(book);
    onOpenChange(false);
  };

  useEffect(() => {
    if (open) return;

    setView("SCANNER");
    setFoundBook(null);
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="h-dvh w-screen max-w-none gap-0 overflow-hidden rounded-none border-0 p-0 sm:h-[90dvh] sm:max-h-[760px] sm:max-w-lg sm:rounded-2xl"
      >
        <section className="relative flex h-full min-h-0 flex-col">
          {view === "SCANNER" && (
            <BookScannerView
              onClose={() => onOpenChange(false)}
              onSearchIsbn={() => setView("ISBN_SEARCH")}
              onManualInput={() => setView("MANUAL_INPUT")}
              onFound={handleFound}
            />
          )}

          {/* {view === "ISBN_SEARCH" && (
            <BookIsbnSearchView
              onBack={() => setView("SCANNER")}
              onFound={handleFound}
            />
          )} */}
          {/* 
          {view === "MANUAL_INPUT" && (
            <BookManualInputView
              onBack={() => setView("SCANNER")}
              onConfirm={handleSelectBook}
            />
          )} */}

          {view === "RESULT" && foundBook && (
            <BookResultView
              book={foundBook}
              onBack={() => setView("SCANNER")}
              onConfirm={() => handleSelectBook(foundBook)}
            />
          )}
        </section>
      </DialogContent>
    </Dialog>
  );
}
