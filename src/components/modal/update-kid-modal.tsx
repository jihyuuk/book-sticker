import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { useUpdateKid } from "@/hooks/mutations/kid/use-update-kid";
import { useUpdateKidModal } from "@/store/update-kid-modal";
import { useOpenAlertModal } from "@/store/alert-modal";
import { toast } from "sonner";
import { useDeleteKid } from "@/hooks/mutations/kid/use-delete-kid";
import { Loader2 } from "lucide-react";
import NumberInput from "../ui/number-input";

export default function UpdateKidModal() {
  const modal = useUpdateKidModal();
  const openAlertModal = useOpenAlertModal();
  const updateKid = useUpdateKid();
  const deleteKid = useDeleteKid();

  const [newName, setNewName] = useState("");
  const [newBookCount, setNewBookCount] = useState(0);
  const [invalidName, setInvalidName] = useState(false);

  const isPending = updateKid.isPending || deleteKid.isPending;

  const isChanged =
    modal.isOpen &&
    (modal.kid.name !== newName.trim() ||
      modal.kid.book_count !== newBookCount);

  //초기화
  useEffect(() => {
    if (!modal.isOpen) return;
    setNewName(modal.kid.name);
    setNewBookCount(modal.kid.book_count);
    setInvalidName(false);
  }, [modal.isOpen]);

  //저장
  const handleSubmit = () => {
    if (isPending || !modal.isOpen || !isChanged) return;

    setInvalidName(false);

    if (!newName.trim()) {
      toast.warning("이름은 필수 입니다.");
      setNewName(newName.trim());
      setInvalidName(true);
      return;
    }

    updateKid.mutate(
      {
        id: modal.kid.id,
        classroomId: modal.kid.classroom_id,
        name: newName.trim(),
        book_count: newBookCount,
      },
      {
        onSuccess: () => {
          toast.success("수정을 성공했어요");
          modal.actions.close();
        },
        onError: () => {
          toast.error("에러 발생");
        },
      },
    );
  };

  //닫기
  const handleClose = () => {
    //입력값 다를떄 물어봐야함
    if (isPending || !modal.isOpen) return;

    if (isChanged) {
      openAlertModal({
        title: "수정이 완료되지 않았습니다",
        description: "이 화면에서 나가면 입력 중이던 내용이 사라집니다.",
        onAction: () => {
          modal.actions.close();
        },
      });
      return;
    }

    modal.actions.close();
  };

  const handleDelete = () => {
    if (isPending || !modal.isOpen) return;

    openAlertModal({
      title: "아이를 삭제할까요?",
      description: "삭제한 아이의 정보는 다시 복구할 수 없습니다.",
      onAction: () => {
        deleteKid.mutate(modal.kid.id, {
          onSuccess: () => {
            toast.success("삭제 완료");
            modal.actions.close();
          },
          onError: () => {
            toast.error("에러 발생");
          },
        });
      },
    });
  };

  return (
    <Dialog open={modal.isOpen} onOpenChange={handleClose}>
      <DialogContent
        className="rounded-lg p-5! pb-4.5! sm:max-w-sm"
        onOpenAutoFocus={(e) => {
          e.preventDefault();
        }}
      >
        <FieldGroup>
          <Field className="flex flex-col gap-2">
            <FieldLabel htmlFor="name">이름</FieldLabel>
            <Input
              id="name"
              autoComplete="off"
              placeholder="이름을 입력해주세요"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              disabled={isPending}
              aria-invalid={invalidName}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="bookCount">패들랫 게시글 수</FieldLabel>
            <NumberInput
              placeholder="패들렛에 올라온 게시글 수를 입력해 주세요"
              value={newName}
              onValueChange={setNewName}
              disabled={isPending}
              aria-invalid={invalidName}
            />
          </Field>
        </FieldGroup>

        <div className="mt-3 flex gap-2">
          {/* <Button
            type="button"
            variant="outline"
            onClick={handleDelete}
            disabled={isPending}
            className="border-rose-200 bg-rose-50 font-semibold text-rose-600 hover:bg-rose-100 hover:text-rose-700"
          >
            삭제
          </Button> */}

          <Button
            className="flex-1"
            onClick={handleSubmit}
            disabled={!isChanged || isPending}
          >
            {isPending ? <Loader2 className="animate-spin" /> : "수정하기"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
