import { Dialog, DialogContent } from "@/components/ui/dialog";
import BookManualInputView from "./book-manual-view";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import BookBarcodeScannerView from "./book-barcode-scanner-view";
import { useOpenAlertModal } from "@/store/alert-modal";
import PostSubmitButton from "@/components/post-field/post-submit-button";
import type { CreatePostParam } from "@/api/post-api";
import { toast } from "sonner";
import { optimizeImage } from "@/lib/image-optimzie";

type PostBook = CreatePostParam["book"];

export type BookInfoData = Omit<PostBook, "coverImageFile">;

const EMPTY_BOOK: BookInfoData = {
  coverUrl: null,
  title: "",
  author: null,
  publisher: null,
  isbn: null,
};

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
  // 저장하기 전까지 부모의 book 데이터는 변경하지 않음
  const [tempBook, setTempBook] = useState<BookInfoData>(EMPTY_BOOK);

  // 직접 선택한 책 표지 파일
  // 최적화가 성공한 JPEG 파일만 저장
  const [tempCoverImageFile, setTempCoverImageFile] = useState<File | null>(
    null,
  );

  // 최적화 중복 실행 방지
  // ref는 변경 즉시 반영되므로 연속 호출도 차단할 수 있음
  const isOptimizingRef = useRef(false);

  // 최적화 진행 상태를 UI에 표시
  // 로딩 스피너 및 버튼 비활성화에 사용
  const [isCoverOptimizing, setIsCoverOptimizing] = useState(false);

  // 기존 저장된 값과 현재 임시 값을 비교
  // File은 객체 참조로 비교
  const isChanged =
    (book?.title ?? "") !== tempBook.title ||
    (book?.author ?? "") !== (tempBook.author ?? "") ||
    (book?.publisher ?? "") !== (tempBook.publisher ?? "") ||
    (book?.isbn ?? "") !== (tempBook.isbn ?? "") ||
    (book?.coverUrl ?? "") !== (tempBook.coverUrl ?? "") ||
    (book?.coverImageFile ?? null) !== tempCoverImageFile;

  // 책 등록 필수 조건
  // 제목 + 저자 + (외부 표지 URL 또는 업로드한 표지)
  const isValidBook = !!tempBook.title.trim() && !!tempBook.author?.trim();

  // 모달 열기/닫기 시 임시 데이터 초기화
  useEffect(() => {
    if (!open) {
      // 모달을 닫으면 임시 변경사항 제거
      setTempCoverImageFile(null);
      setTempBook(EMPTY_BOOK);
      return;
    }

    // 모달을 열면 부모의 기존 책 정보를 복사
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

    // 기존에 등록한 표지 파일이 있다면 복원
    // File 객체 자체를 복사하는 것이 아니라 참조를 전달
    setTempCoverImageFile(book?.coverImageFile ?? null);

    // 항상 직접 입력 화면부터 시작
    setView("MANUAL_INPUT");
  }, [open, book]);

  // --------------------------------------------------
  // 책 표지 선택 및 최적화
  // --------------------------------------------------
  const handleCoverSelect = async (file: File) => {
    // 이미 최적화 중이면 중복 실행 차단
    if (isOptimizingRef.current) return;

    // 실행 잠금 + 로딩 시작
    isOptimizingRef.current = true;
    setIsCoverOptimizing(true);

    try {
      // JPEG 변환 및 이미지 용량 최적화
      const optimizedFile = await optimizeImage(file);

      // 최적화 성공 시에만 파일 변경
      // 실패하면 기존 파일과 외부 URL은 그대로 유지
      setTempCoverImageFile(optimizedFile);

      // 직접 업로드한 표지를 사용하므로 외부 URL 제거
      setTempBook((prev) => ({
        ...prev,
        coverUrl: null,
      }));
    } catch (error) {
      // 최적화 실패 시 기존 데이터는 변경하지 않음
      console.error("책 표지 최적화 실패:", error);
      toast.error("책 표지 업로드 실패!");
    } finally {
      // 성공/실패 여부와 관계없이 실행 잠금 해제
      isOptimizingRef.current = false;
      setIsCoverOptimizing(false);
    }
  };

  // --------------------------------------------------
  // 책 표지 삭제
  // --------------------------------------------------
  const handleCoverRemove = () => {
    // 최적화 중에는 삭제 차단
    if (isOptimizingRef.current) return;

    // 외부 URL과 직접 업로드한 파일 모두 제거
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
    // 최적화 중이거나 필수 정보가 없으면 저장 차단
    if (isOptimizingRef.current || !isValidBook) return;

    // 부모 컴포넌트에 최종 책 정보 전달
    onBookChange({
      title: tempBook.title.trim(),
      author: tempBook.author?.trim() || null,
      publisher: tempBook.publisher?.trim() || null,
      isbn: tempBook.isbn?.trim() || null,

      // 직접 업로드한 파일이 있다면 외부 URL은 사용하지 않음
      coverUrl: tempCoverImageFile ? null : tempBook.coverUrl?.trim() || null,

      // 최적화된 JPEG 파일 또는 null
      coverImageFile: tempCoverImageFile,
    });

    // 저장 완료 후 모달 닫기
    onOpenChange(false);
  };

  // --------------------------------------------------
  // 모달 닫기
  // --------------------------------------------------
  const handleClose = () => {
    // 이미지 최적화 중에는 모달 닫기 차단
    if (isOptimizingRef.current) return;

    // 변경사항이 존재하면 확인 모달 표시
    if (isChanged) {
      openAlertModal({
        title: "저장되지 않은 변경사항이 있습니다",
        description: "이 화면을 닫으면 입력 중이던 내용이 사라집니다.",
        onAction: () => {
          if (!isOptimizingRef.current) {
            onOpenChange(false);
          }
        },
      });
      return;
    }

    // 변경사항이 없으면 바로 닫기
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        // Dialog가 닫기를 요청할 때만 처리
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

              // 최적화 중에는 바코드 화면으로 이동 차단
              onChangeView={(nextView) => {
                if (isOptimizingRef.current) return;
                setView(nextView);
              }}

              // 표지 파일 및 로딩 상태 전달
              coverImageFile={tempCoverImageFile}
              isCoverOptimizing={isCoverOptimizing}
              onCoverSelect={handleCoverSelect}
              onCoverRemove={handleCoverRemove}
            />

            {/* 책 등록 버튼 */}
            <PostSubmitButton
              onClick={handleConfirm}
              disabled={!isChanged || !isValidBook || isCoverOptimizing}
            >
              책 등록하기
            </PostSubmitButton>
          </>
        )}

        {view === "SCANNER" && (
          <BookBarcodeScannerView
            // 바코드 검색 결과를 임시 책 정보에 반영
            onBookChange={(value) => {
              setTempBook(value);

              // 외부 검색 결과를 선택했으므로
              // 이전에 직접 선택했던 표지 파일은 제거
              setTempCoverImageFile(null);
            }}
            onBack={() => setView("MANUAL_INPUT")}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
