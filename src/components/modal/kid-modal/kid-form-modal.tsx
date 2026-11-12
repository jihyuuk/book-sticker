import { useCallback, useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { Loader2, UserRound, X } from "lucide-react";
import { toast } from "sonner";

import type { Kid } from "@/types/entity-types";
import { useCreateKid } from "@/hooks/mutations/kid/use-create-kid";
import { useUpdateKid } from "@/hooks/mutations/kid/use-update-kid";
import { useOpenAlertModal } from "@/store/alert-modal";

import { Dialog, DialogContent } from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Field, FieldGroup, FieldLabel } from "../../ui/field";
import { Input } from "../../ui/input";
import StepperNumberInput from "./stepper-number-input";

// 모달 상태
export type KidModalState =
  { type: "CREATE" } | { type: "UPDATE"; kid: Kid } | null;

// 이미지 변경 상태
type ProfileImageDraft =
  | { type: "KEEP" }
  | { type: "UPLOAD"; file: File; previewUrl: string }
  | { type: "DELETE" };

type Props = {
  classroomId: string;
  mode: KidModalState;
  onClose: () => void;
};

export default function KidFormModal({ classroomId, mode, onClose }: Props) {
  const openAlertModal = useOpenAlertModal();

  // 뮤테이션
  const createKid = useCreateKid();
  const updateKid = useUpdateKid();

  // 입력 상태
  const [name, setName] = useState("");
  const [bookCount, setBookCount] = useState("0");

  // 프로필 이미지
  const fileInputRef = useRef<HTMLInputElement>(null);
  const objectUrlRef = useRef<string | null>(null);

  const [imageDraft, setImageDraft] = useState<ProfileImageDraft>({
    type: "KEEP",
  });

  // 모달 상태
  const isOpen = mode !== null;
  const isUpdate = mode?.type === "UPDATE";
  const isPending = createKid.isPending || updateKid.isPending;

  // 닫힘 애니메이션 동안 마지막 모달 정보 유지
  const [lastMode, setLastMode] = useState<KidModalState>(mode);

  if (mode && mode !== lastMode) {
    setLastMode(mode);
  }

  const displayMode = mode ?? lastMode;

  // 기존 프로필 이미지
  const originalImageUrl =
    displayMode?.type === "UPDATE" ? displayMode.kid.profile_image_url : null;

  // 현재 표시할 이미지
  const previewUrl =
    imageDraft.type === "UPLOAD"
      ? imageDraft.previewUrl
      : imageDraft.type === "DELETE"
        ? null
        : originalImageUrl;

  const hasProfileImg = Boolean(previewUrl);
  const isImageChanged = imageDraft.type !== "KEEP";

  // 변경 여부
  const isChanged = mode
    ? mode.type === "UPDATE"
      ? name.trim() !== mode.kid.name ||
        Number(bookCount) !== mode.kid.book_count ||
        isImageChanged
      : name.trim() !== "" || bookCount !== "0" || isImageChanged
    : false;

  // 임시 URL 해제
  const revokePreviewUrl = useCallback(() => {
    if (!objectUrlRef.current) return;

    URL.revokeObjectURL(objectUrlRef.current);
    objectUrlRef.current = null;
  }, []);

  // 초기값 설정
  useEffect(() => {
    // 닫힐 때는 초기화하지 않음
    if (!mode) return;

    // 새로 열 때만 초기화
    revokePreviewUrl();
    setImageDraft({ type: "KEEP" });

    const isUpdate = mode.type === "UPDATE";

    setName(isUpdate ? mode.kid.name : "");
    setBookCount(isUpdate ? String(mode.kid.book_count) : "0");
  }, [mode, revokePreviewUrl]);

  // 컴포넌트 언마운트 시 URL 정리
  useEffect(() => {
    return () => {
      revokePreviewUrl();
    };
  }, [revokePreviewUrl]);

  // 이미지 선택
  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.warning("이미지 파일을 선택해 주세요.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.warning("이미지는 10MB 이하만 등록할 수 있습니다.");
      return;
    }

    // 기존 미리보기 URL 정리
    revokePreviewUrl();

    // 원본 파일 미리보기
    const url = URL.createObjectURL(file);
    objectUrlRef.current = url;

    setImageDraft({
      type: "UPLOAD",
      file,
      previewUrl: url,
    });
  };

  // 이미지 삭제
  const handleImageDelete = () => {
    revokePreviewUrl();

    setImageDraft({
      type: originalImageUrl ? "DELETE" : "KEEP",
    });
  };

  // 닫기
  const handleClose = () => {
    if (!isOpen || isPending) return;

    if (isChanged) {
      openAlertModal({
        title: "저장되지 않은 변경사항이 있습니다",
        description: "이 화면에서 나가면 입력 중이던 내용이 사라집니다.",
        onAction: onClose,
      });
      return;
    }

    onClose();
  };

  // 등록 및 수정
  const handleSubmit = () => {
    if (isPending || !mode) return;

    const trimmedName = name.trim();

    if (!trimmedName) {
      toast.warning("이름은 필수입니다.");
      return;
    }

    if (!bookCount) {
      toast.warning("게시글 수를 입력해 주세요.");
      return;
    }

    // 생성
    if (mode.type === "CREATE") {
      createKid.mutate(
        {
          classroomId,
          name: trimmedName,
          bookCount: Number(bookCount),
          profileImage:
            imageDraft.type === "UPLOAD" ? imageDraft.file : undefined,
        },
        {
          onSuccess: () => {
            toast.success("등록 완료");
            onClose();
          },
          onError: () => {
            toast.error("등록 실패");
          },
        },
      );

      return;
    }

    // 수정
    updateKid.mutate(
      {
        kidId: mode.kid.id,
        classroomId: mode.kid.classroom_id,
        name: trimmedName,
        bookCount: Number(bookCount),
        profileImage:
          imageDraft.type === "UPLOAD"
            ? imageDraft.file
            : imageDraft.type === "DELETE"
              ? null
              : undefined,
      },
      {
        onSuccess: () => {
          toast.success("수정 완료");
          onClose();
        },
        onError: () => {
          toast.error("수정 실패");
        },
      },
    );
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent
        className="max-w-[min(24rem,calc(100%-4rem))] rounded-lg p-5! pb-4.5! sm:max-w-sm"
        onOpenAutoFocus={(event) => {
          if (window.matchMedia("(pointer: coarse)").matches) {
            event.preventDefault();
          }
        }}
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          {/* 프로필 이미지 */}
          <div className="flex justify-center py-3">
            <div className="relative">
              {/* 숨겨진 파일 입력 */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
                disabled={isPending}
              />

              {/* 이미지 추가 / 변경 */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isPending}
                aria-label={
                  hasProfileImg ? "프로필 사진 변경" : "프로필 사진 추가"
                }
                className="bg-muted text-muted-foreground flex size-24 items-center justify-center overflow-hidden rounded-full transition-opacity hover:opacity-80 disabled:opacity-50"
              >
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="프로필 이미지"
                    className="size-full object-cover"
                  />
                ) : (
                  <UserRound className="size-12" />
                )}
              </button>

              {/* 이미지 삭제 */}
              {hasProfileImg && (
                <button
                  type="button"
                  onClick={handleImageDelete}
                  disabled={isPending}
                  aria-label="프로필 사진 삭제"
                  className="border-background text-background absolute top-0 right-0 flex size-8 items-center justify-center rounded-full border-4 bg-gray-500"
                >
                  <X className="size-3.5" strokeWidth={2.5} />
                </button>
              )}
            </div>
          </div>

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="kid-name">이름</FieldLabel>
              <Input
                id="kid-name"
                autoComplete="off"
                placeholder="이름을 입력해 주세요"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isPending}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="kid-book-count">패들렛 게시글 수</FieldLabel>
              <StepperNumberInput
                id="kid-book-count"
                value={bookCount}
                onValueChange={setBookCount}
                disabled={isPending}
              />
            </Field>
          </FieldGroup>

          <Button
            type="submit"
            className="mt-8 w-full"
            disabled={
              isPending ||
              !name.trim() ||
              !bookCount ||
              (isUpdate && !isChanged)
            }
          >
            {isPending ? (
              <Loader2 className="animate-spin" />
            ) : isUpdate ? (
              "수정하기"
            ) : (
              "등록하기"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
