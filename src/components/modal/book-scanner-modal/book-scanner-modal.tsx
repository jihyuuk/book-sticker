import { Dialog, DialogContent } from "@/components/ui/dialog";
import BookManualInputView from "./book-manual-view";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import BookBarcodeScannerView from "./book-barcode-scanner-view";
import { useOpenAlertModal } from "@/store/alert-modal";
import PostSubmitButton from "@/components/post-field/post-submit-button";
import type { CreatePostParam } from "@/api/post-api";
import { toast } from "sonner";

type PostBook = CreatePostParam["book"];

export type BookInfoData = Omit<PostBook, "coverImageFile">;

const EMPTY_BOOK: BookInfoData = {
  coverUrl: null,
  title: "",
  author: null,
  publisher: null,
  isbn: null,
};

const MAX_COVER_SIZE = 10 * 1024 * 1024;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  book: PostBook | null;
  onBookChange: (book: PostBook | null) => void;
};

export type BookModalView = "MANUAL_INPUT" | "SCANNER";

export default function BookScannerModal({
  open,
  onOpenChange,
  book,
  onBookChange,
}: Props) {
  const openAlertModal = useOpenAlertModal();

  // 현재 모달 화면
  const [view, setView] = useState<BookModalView>("MANUAL_INPUT");

  // 모달에서 임시로 수정하는 책 정보
  const [tempBook, setTempBook] = useState<BookInfoData>(EMPTY_BOOK);

  // 직접 선택한 원본 책 표지 파일
  const [tempCoverImageFile, setTempCoverImageFile] = useState<File | null>(
    null,
  );

  // 기존 저장된 값과 현재 임시 값을 비교
  const isChanged =
    (book?.title ?? "") !== tempBook.title ||
    (book?.author ?? "") !== (tempBook.author ?? "") ||
    (book?.publisher ?? "") !== (tempBook.publisher ?? "") ||
    (book?.isbn ?? "") !== (tempBook.isbn ?? "") ||
    (book?.coverUrl ?? "") !== (tempBook.coverUrl ?? "") ||
    (book?.coverImageFile ?? null) !== tempCoverImageFile;

  // 책 등록 필수 조건
  const isValidBook = !!tempBook.title.trim() && !!tempBook.author?.trim();

  // 모달 열기/닫기 시 임시 데이터 초기화
  useEffect(() => {
    if (!open) {
      setTempCoverImageFile(null);
      setTempBook(EMPTY_BOOK);
      return;
    }

    // 부모의 기존 책 정보 복원
    setTempBook(
      book
        ? {
            isbn: book.isbn,
            title: book.title,
            author: book.author,
            publisher: book.publisher,
            coverUrl: book.coverUrl,
          }
        : EMPTY_BOOK,
    );

    // 기존에 선택한 원본 File 유지
    setTempCoverImageFile(book?.coverImageFile ?? null);

    // 항상 직접 입력 화면부터 시작
    setView("MANUAL_INPUT");
  }, [open, book]);

  // --------------------------------------------------
  // 책 표지 선택
  // --------------------------------------------------
  const handleCoverSelect = (file: File) => {
    const name = file.name.toLowerCase();
    const type = file.type.toLowerCase();

    // GIF 차단
    if (type === "image/gif" || name.endsWith(".gif")) {
      toast.error("GIF 이미지는 업로드할 수 없습니다.");
      return;
    }

    // 이미지 형식 확인
    const isImage = type.startsWith("image/") || /\.(heic|heif)$/i.test(name);

    if (!isImage) {
      toast.error("이미지 파일만 등록할 수 있습니다.");
      return;
    }

    // 빈 파일 차단
    if (file.size === 0) {
      toast.error("비어 있는 이미지 파일입니다.");
      return;
    }

    // 10MB 초과 차단
    if (file.size > MAX_COVER_SIZE) {
      toast.error("책 표지는 최대 10MB까지 등록할 수 있습니다.");
      return;
    }

    // 검증 완료된 원본 파일 저장
    setTempCoverImageFile(file);

    // 직접 선택한 표지를 사용하므로 외부 URL 제거
    setTempBook((prev) => ({
      ...prev,
      coverUrl: null,
    }));
  };

  // --------------------------------------------------
  // 책 표지 삭제
  // --------------------------------------------------
  const handleCoverRemove = () => {
    // 외부 URL과 직접 선택한 파일 모두 제거
    setTempBook((prev) => ({
      ...prev,
      coverUrl: null,
    }));

    setTempCoverImageFile(null);
  };

  // --------------------------------------------------
  // 책 정보 저장
  // --------------------------------------------------
  const handleConfirm = () => {
    if (!isValidBook) return;

    // 부모 컴포넌트에 최종 책 정보 전달
    // 이 시점에서는 Cloudflare 업로드하지 않음
    onBookChange({
      title: tempBook.title.trim(),
      author: tempBook.author?.trim() || null,
      publisher: tempBook.publisher?.trim() || null,
      isbn: tempBook.isbn?.trim() || null,

      // 파일 직접 선택 시 외부 URL 사용 안 함
      coverUrl: tempCoverImageFile ? null : tempBook.coverUrl?.trim() || null,

      // 원본 File 그대로 전달
      coverImageFile: tempCoverImageFile,
    });

    onOpenChange(false);
  };

  // --------------------------------------------------
  // 모달 닫기
  // --------------------------------------------------
  const handleClose = () => {
    // 변경사항이 존재하면 확인 모달 표시
    if (isChanged) {
      openAlertModal({
        title: "저장되지 않은 변경사항이 있습니다",
        description: "이 화면을 닫으면 입력 중이던 내용이 사라집니다.",
        onAction: () => {
          onOpenChange(false);
        },
      });
      return;
    }

    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) handleClose();
      }}
    >
      <DialogContent
        onPointerDownOutside={(e) => e.preventDefault()}
        showCloseButton={false}
        className={cn(
          // 기본 스타일
          "flex h-dvh w-screen max-w-none flex-col gap-0 overflow-hidden rounded-none border-0 p-0",
          "sm:h-[90dvh] sm:max-h-190 sm:max-w-lg sm:rounded-2xl",
          "h-[98dvh] rounded-t-4xl",

          // 모바일 위치
          "top-auto bottom-0 left-0 translate-x-0 translate-y-0",

          // 모바일 애니메이션
          "data-open:slide-in-from-bottom-full",
          "data-closed:slide-out-to-bottom-full",
          "data-open:zoom-in-100 data-closed:zoom-out-100",
          "max-sm:data-open:fade-in-100 max-sm:data-closed:fade-out-100",
          "duration-300",

          // PC 위치
          "sm:top-1/2 sm:bottom-auto sm:left-1/2",
          "sm:-translate-x-1/2 sm:-translate-y-1/2",

          // PC 애니메이션
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
              coverImageFile={tempCoverImageFile}
              onCoverSelect={handleCoverSelect}
              onCoverRemove={handleCoverRemove}
            />

            {/* 책 등록 버튼 */}
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
            // 검색 결과를 임시 책 정보에 반영
            onBookChange={(value) => {
              setTempBook(value);

              // 외부 검색 결과 선택 시 직접 선택한 표지 제거
              setTempCoverImageFile(null);
            }}
            onBack={() => setView("MANUAL_INPUT")}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
