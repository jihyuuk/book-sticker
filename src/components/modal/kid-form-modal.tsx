import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import type { Kid } from "@/types/entity-types";
import { useCreateKid } from "@/hooks/mutations/kid/use-create-kid";
import { useUpdateKid } from "@/hooks/mutations/kid/use-update-kid";
import { useOpenAlertModal } from "@/store/alert-modal";

import { Dialog, DialogContent } from "../ui/dialog";
import { Button } from "../ui/button";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import NumberInput from "../ui/number-input";

// 모달 상태
export type KidModalState =
  { type: "CREATE" } | { type: "UPDATE"; kid: Kid } | null;

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

  // 모달 상태
  const isOpen = mode !== null;
  const isUpdate = mode?.type === "UPDATE";
  const isPending = createKid.isPending || updateKid.isPending;

  // 변경 여부
  const isChanged = mode
    ? mode.type === "UPDATE"
      ? name.trim() !== mode.kid.name ||
        Number(bookCount) !== mode.kid.book_count
      : name.trim() !== "" || bookCount !== "0"
    : false;

  // 초기값 설정
  useEffect(() => {
    if (!mode) return;

    const isUpdate = mode?.type === "UPDATE";

    setName(isUpdate ? mode.kid.name : "");
    setBookCount(isUpdate ? String(mode.kid.book_count) : "0");
  }, [mode]);

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
          classroom_id: classroomId,
          name: trimmedName,
          book_count: Number(bookCount),
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
        id: mode.kid.id,
        classroomId: mode.kid.classroom_id,
        name: trimmedName,
        book_count: Number(bookCount),
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
        className="rounded-lg p-5! pb-4.5! sm:max-w-sm"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
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
            <NumberInput
              value={bookCount}
              onValueChange={setBookCount}
              disabled={isPending}
            />
          </Field>
        </FieldGroup>

        <Button
          className="mt-3 w-full"
          onClick={handleSubmit}
          disabled={
            isPending || !name.trim() || !bookCount || (isUpdate && !isChanged)
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
      </DialogContent>
    </Dialog>
  );
}
