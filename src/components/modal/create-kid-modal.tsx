import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { useCreateKid } from "@/hooks/mutations/use-create-kid";
import { useCreateKidModalStore } from "@/store/create-kid-modal-store";

export default function CreateKidModal() {
  const modal = useCreateKidModalStore();
  const createKid = useCreateKid();
  const [name, setName] = useState("");

  useEffect(() => {
    if (!modal.isOpen) return;
    setName("");
  }, [modal.isOpen]);

  const handleClose = () => {
    if (createKid.isPending) return;

    if (!name.trim()) {
      setName(name.trim());
      alert("확인필요");
      return;
    }
    modal.actions.close();
  };

  const handleSubmit = () => {
    createKid.mutate(name.trim(), {
      onSuccess: () => {
        alert("성공");
        modal.actions.close();
      },
      onError: (error) => {
        alert(error);
      },
    });
  };

  return (
    <Dialog open={modal.isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>어린이 추가</DialogTitle>
        </DialogHeader>
        <div>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">이름</FieldLabel>
              <Input
                id="name"
                autoComplete="off"
                placeholder="이름..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={createKid.isPending}
              />
            </Field>
          </FieldGroup>
        </div>

        <div className="flex justify-end gap-1">
          <Button
            variant={"outline"}
            className="px-4 py-4"
            onClick={handleClose}
            disabled={createKid.isPending}
          >
            취소
          </Button>
          <Button
            className="px-6 py-4"
            onClick={handleSubmit}
            disabled={createKid.isPending}
          >
            저장
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
