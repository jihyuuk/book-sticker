import { Dialog, DialogContent } from "../ui/dialog";
import { Field, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { useOpenAlertModal } from "@/store/alert-modal";
import { useCreateClassroom } from "@/hooks/mutations/classroom/use-create-classroom";
import { toast } from "sonner";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function CreateClassroomModal({ open, setOpen }: Props) {
  const openAlertModal = useOpenAlertModal();
  const { mutate, isPending } = useCreateClassroom();

  const [name, setName] = useState("");

  const trimmedName = name.trim();
  const canSubmit = trimmedName.length > 0 && !isPending;

  const handleSubmit = () => {
    if (!canSubmit) return;

    mutate(
      {
        name: trimmedName,
        is_public: true,
      },
      {
        onSuccess: () => {
          toast.success("반이 추가되었습니다.");
          setOpen(false);
        },
        onError: () => {
          toast.error("반 추가에 실패했습니다.");
        },
      },
    );
  };

  const handleClose = () => {
    if (isPending) return;

    if (name.trim()) {
      openAlertModal({
        title: "추가가 완료되지 않았습니다",
        description: "이 화면에서 나가면 입력 중이던 내용이 사라집니다.",
        onAction: () => {
          setOpen(false);
        },
      });
      return;
    }

    setOpen(false);
  };

  useEffect(() => {
    if (open) setName("");
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="rounded-3xl border-4 border-gray-100 p-6 shadow-xl sm:max-w-md"
        onOpenAutoFocus={(e) => {
          e.preventDefault();
        }}
      >
        <div className="mt-2 space-y-6">
          <Field className="flex flex-col gap-2">
            <FieldLabel
              htmlFor="name"
              className="ml-1 text-base font-bold text-gray-700 md:text-lg"
            >
              반 이름
            </FieldLabel>
            {/* 리팩토링 - truncate */}
            <Input
              id="name"
              autoComplete="off"
              placeholder="반 이름을 입력해주세요"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isPending}
              className="h-12 rounded-2xl border-2 border-gray-200 px-4 text-base transition-all focus-visible:border-sky-400 focus-visible:ring-sky-200 md:h-14 md:text-lg"
            />
          </Field>
        </div>

        <Button
          onClick={handleSubmit}
          className="mt-8 h-14 flex-1 rounded-2xl border-none bg-sky-400 text-lg font-bold text-white shadow-[0_4px_0_0_rgba(14,165,233,1)] transition-all hover:bg-sky-500 active:translate-y-1 active:shadow-none"
          disabled={!canSubmit}
        >
          추가하기
        </Button>
      </DialogContent>
    </Dialog>
  );
}
