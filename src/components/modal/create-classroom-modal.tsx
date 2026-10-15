import { Dialog, DialogContent } from "../ui/dialog";
import { Field, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { useOpenAlertModal } from "@/store/alert-modal";
import { useCreateClassroom } from "@/hooks/mutations/classroom/use-create-classroom";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

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
          toast.success("새로운 반이 생성되었습니다.");
          setOpen(false);
        },
        onError: () => {
          toast.error("반 생성에 실패했습니다.");
        },
      },
    );
  };

  const handleClose = () => {
    if (isPending) return;

    if (name.trim()) {
      openAlertModal({
        title: "작업이 완료되지 않았습니다",
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
        className="rounded-lg p-5! pb-4.5! sm:max-w-sm"
        onOpenAutoFocus={(event) => {
          if (window.matchMedia("(pointer: coarse)").matches) {
            event.preventDefault();
          }
        }}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <Field>
            <FieldLabel
              htmlFor="classroom-name"
              className="text-headline-5 mb-1 font-semibold"
            >
              반 이름
            </FieldLabel>

            <Input
              id="classroom-name"
              autoComplete="off"
              placeholder="반 이름을 입력해주세요"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isPending}
            />
          </Field>

          <Button
            type="submit"
            className="mt-3 w-full rounded-md"
            disabled={!canSubmit || isPending}
          >
            {isPending ? <Loader2 className="animate-spin" /> : "생성하기"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
