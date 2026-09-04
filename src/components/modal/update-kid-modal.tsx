import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { useUpdateKid } from "@/hooks/mutations/use-update-kid";
import { useUpdateKidModal } from "@/store/update-kid-modal";

export default function UpdateKidModal() {
  const modal = useUpdateKidModal();
  const [newName, setNewName] = useState("");
  const [newCount, setNewCount] = useState(0);
  const updateKid = useUpdateKid();

  const handleClose = () => {
    modal.actions.close();
  };

  const handleSubmit = () => {
    if (updateKid.isPending) return;

    if (!newName.trim()) return;
    if (!modal.isOpen) return;

    updateKid.mutate(
      { id: modal.kid.id, name: newName, bookCount: newCount },
      {
        onSuccess: () => {
          alert("수정 성공");
          handleClose();
        },
        onError: (error) => {
          alert(error);
        },
      },
    );
  };

  useEffect(() => {
    if (!modal.isOpen) return;

    setNewName(modal.kid.name);
    setNewCount(modal.kid.bookCount);
  }, [modal.isOpen]);

  return (
    <Dialog open={modal.isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>홍길동</DialogTitle>
        </DialogHeader>
        <div>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="newName">이름</FieldLabel>
              <Input
                id="newName"
                autoComplete="off"
                placeholder="이름..."
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                disabled={updateKid.isPending}
              />
            </Field>
          </FieldGroup>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="newNbame">책</FieldLabel>
              <Input
                id="newNbame"
                autoComplete="off"
                placeholder="책"
                value={newCount}
                onChange={(e) => setNewCount(e.target.value)}
                disabled={updateKid.isPending}
              />
            </Field>
          </FieldGroup>
        </div>

        <div className="flex justify-end gap-1">
          <Button
            variant={"outline"}
            className="px-4 py-4"
            onClick={handleClose}
            disabled={updateKid.isPending}
          >
            취소
          </Button>
          <Button
            className="px-6 py-4"
            onClick={handleSubmit}
            disabled={updateKid.isPending}
          >
            저장
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
