import { useEffect, useState, type ChangeEvent } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { useCreateKid } from "@/hooks/mutations/kid/use-create-kid";
import { useCreateKidModalStore } from "@/store/create-kid-modal-store";
import { useOpenAlertModal } from "@/store/alert-modal";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import NumberInput from "../ui/number-input";

export default function CreateKidModal() {
  const modal = useCreateKidModalStore();
  const openAlertModal = useOpenAlertModal();

  const createKid = useCreateKid();
  const [name, setName] = useState("");
  const [bookCount, setBookCount] = useState("0");

  const [invalidName, setInvalidName] = useState(false);

  useEffect(() => {
    if (!modal.isOpen) return;
    setName("");
    setBookCount("0");
    setInvalidName(false);
  }, [modal.isOpen]);

  const handleClose = () => {
    if (createKid.isPending || !modal.isOpen) return;

    if (name.trim() || (bookCount && bookCount !== "0")) {
      openAlertModal({
        title: "추가가 완료되지 않았습니다",
        description: "이 화면에서 나가면 입력 중이던 내용이 사라집니다.",
        onAction: () => {
          modal.actions.close();
        },
      });
      return;
    }

    modal.actions.close();
  };

  const handleSubmit = () => {
    setInvalidName(false);

    if (!name.trim()) {
      toast.warning("이름은 필수 입니다.");
      setName(name.trim());
      setInvalidName(true);
      return;
    }

    if (!bookCount) {
      //필수
    }

    if (!modal.classroomId) {
      toast.error("반 정보를 찾을 수 없습니다.");
      return;
    }

    createKid.mutate(
      {
        classroom_id: modal.classroomId,
        name: name.trim(),
        book_count: Number(bookCount),
      },
      {
        onSuccess: () => {
          toast.success("추가를 성공했어요");
          modal.actions.close();
        },
        onError: () => {
          toast.error("오류 발생");
        },
      },
    );
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
          <Field>
            <FieldLabel htmlFor="name">이름</FieldLabel>

            <Input
              id="name"
              autoComplete="off"
              placeholder="이름을 입력해 주세요"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={createKid.isPending}
              aria-invalid={invalidName}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="bookCount">패들랫 게시글 수</FieldLabel>
            <NumberInput
              placeholder="패들랫에 올라온 게시글의 수를 적어주세요."
              value={bookCount}
              onValueChange={setBookCount}
              disabled={createKid.isPending}
              aria-invalid={invalidName}
            />
          </Field>
        </FieldGroup>

        <Button
          onClick={handleSubmit}
          disabled={createKid.isPending || !name.trim() || !bookCount}
          className="mt-3 flex-1 rounded-md"
        >
          {createKid.isPending ? (
            <Loader2 className="animate-spin" />
          ) : (
            "등록하기"
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
