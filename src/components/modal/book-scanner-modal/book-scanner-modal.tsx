import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { BookInfoData } from "@/components/book/book-info";
import BookManualInputView from "./book-manual-view";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import BookBarcodeScannerView from "./book-barcode-scanner-view";
import { useOpenAlertModal } from "@/store/alert-modal";
import PostSubmitButton from "@/components/post-field/post-submit-button";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  book: BookInfoData | null;
  onBookChange: (book: BookInfoData | null) => void;
};

export type BookModalView = "MANUAL_INPUT" | "SCANNER";

export default function BookScannerModal({
  open,
  onOpenChange,
  book,
  onBookChange,
}: Props) {
  const openAlertModal = useOpenAlertModal();
  const [view, setView] = useState<BookModalView>("MANUAL_INPUT");
  const [tempBook, setTempBook] = useState<BookInfoData>({
    cover_url: "",
    title: "",
    author: "",
    publisher: "",
    isbn: "",
  });

  //값 변경 확인
  const isChanged =
    (book?.title ?? "") !== tempBook.title ||
    (book?.author ?? "") !== (tempBook.author ?? "") ||
    (book?.publisher ?? "") !== (tempBook.publisher ?? "") ||
    (book?.isbn ?? "") !== (tempBook.isbn ?? "") ||
    (book?.cover_url ?? "") !== (tempBook.cover_url ?? "");

  // 필수값 검증
  const isValidBook =
    // !!tempBook.cover_url?.trim() &&
    !!tempBook.title.trim() && !!tempBook.author?.trim();

  useEffect(() => {
    if (!open) return;
    setTempBook(
      book ?? {
        cover_url: "",
        title: "",
        author: "",
        publisher: "",
        isbn: "",
      },
    );
    setView("MANUAL_INPUT");
  }, [open, book]);

  const handleConfirm = () => {
    onBookChange({
      title: tempBook.title.trim(),
      author: tempBook.author?.trim() || null,
      publisher: tempBook.publisher?.trim() || null,
      isbn: tempBook.isbn?.trim() || null,
      cover_url: tempBook.cover_url?.trim() || null,
    });

    onOpenChange(false);
  };

  const handleClose = () => {
    //변경 되었으면 alert
    if (isChanged) {
      openAlertModal({
        title: "저장되지 않은 변경사항이 있습니다",
        description: "이 화면을 닫으면 입력 중이던 내용이 사라집니다.",
        onAction: () => onOpenChange(false),
      });
      return;
    }

    //그대로면 닫기
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          // 기본 스타일
          "h-dvh w-screen max-w-none gap-0 overflow-hidden rounded-none border-0 p-0",
          "sm:h-[90dvh] sm:max-h-190 sm:max-w-lg sm:rounded-2xl",

          // 모바일 위치
          "top-auto bottom-0 left-0 translate-x-0 translate-y-0",

          // 모바일 애니메이션 (Slide)
          "data-open:slide-in-from-bottom-full",
          "data-closed:slide-out-to-bottom-full",
          "data-open:zoom-in-100 data-closed:zoom-out-100",
          "max-sm:data-open:fade-in-100 max-sm:data-closed:fade-out-100",
          "duration-300",

          // PC 위치
          "sm:top-1/2 sm:bottom-auto sm:left-1/2",
          "sm:-translate-x-1/2 sm:-translate-y-1/2",

          // PC 애니메이션 (shadcn 기본 Fade + Zoom)
          "sm:data-open:zoom-in-95",
          "sm:data-closed:zoom-out-95",
          "sm:data-open:slide-in-from-bottom-0",
          "sm:data-closed:slide-out-to-bottom-0",
          "sm:duration-100",
        )}
      >
        {view === "MANUAL_INPUT" && (
          <>
            <BookManualInputView
              book={tempBook}
              onBookChange={setTempBook}
              onBack={handleClose}
              onChangeView={setView}
            />

            {/* 하단 버튼 */}
            <PostSubmitButton
              onClick={handleConfirm}
              disabled={!isChanged || !isValidBook}
            >
              책 등록하기
            </PostSubmitButton>
          </>
        )}

        {view === "SCANNER" && (
          <BookBarcodeScannerView
            onBookChange={setTempBook}
            onBack={() => setView("MANUAL_INPUT")}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
