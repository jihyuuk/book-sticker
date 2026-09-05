import { useEffect, useState, type ChangeEvent } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { useUpdateKid } from "@/hooks/mutations/kid/use-update-kid";
import { useUpdateKidModal } from "@/store/update-kid-modal";
import { useOpenAlertModal } from "@/store/alert-modal";
import { toast } from "sonner";
import { useDeleteKid } from "@/hooks/mutations/kid/use-delete-kid";

export default function UpdateKidModal() {
  const modal = useUpdateKidModal();
  const openAlertModal = useOpenAlertModal();
  const updateKid = useUpdateKid();
  const deleteKid = useDeleteKid();

  const [newName, setNewName] = useState("");
  const [newBookCount, setNewBookCount] = useState(0);

  //초기화
  useEffect(() => {
    if (!modal.isOpen) return;

    setNewName(modal.kid.name);
    setNewBookCount(modal.kid.book_count);
  }, [modal.isOpen]);

  //저장
  const handleSubmit = () => {
    if (updateKid.isPending || !modal.isOpen) return;

    //이름 필수
    if (!newName.trim()) return;

    updateKid.mutate(
      { id: modal.kid.id, name: newName, book_count: newBookCount },
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
    if (!modal.isOpen) return;

    if (modal.kid.name !== newName || modal.kid.book_count !== newBookCount) {
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

  const handleBookCountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value.replace(/\D/g, ""));
    setNewBookCount(value);
  };

  const handleIncrement = () => setNewBookCount((prev) => prev + 1);
  const handleDecrement = () =>
    setNewBookCount((prev) => (prev > 0 ? prev - 1 : 0));

  const moveCursorToEnd = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const end = input.value.length;

    input.setSelectionRange(end, end);
  };

  const handleDelete = () => {
    if (!modal.isOpen) return;

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
        className="rounded-3xl border-4 border-gray-100 p-6 shadow-xl sm:max-w-md"
        onOpenAutoFocus={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800 md:text-2xl">
            어린이 수정
          </DialogTitle>
        </DialogHeader>

        <div className="mt-2 space-y-6">
          <FieldGroup className="space-y-2 md:space-y-5">
            <Field className="flex flex-col gap-2">
              <FieldLabel
                htmlFor="name"
                className="ml-1 text-base font-bold text-gray-700 md:text-lg"
              >
                이름
              </FieldLabel>
              <Input
                id="name"
                autoComplete="off"
                placeholder="이름을 입력해주세요"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                disabled={updateKid.isPending}
                className="h-12 rounded-2xl border-2 border-gray-200 px-4 text-base transition-all focus-visible:border-sky-400 focus-visible:ring-sky-200 md:h-14 md:text-lg"
              />
            </Field>

            <Field className="flex flex-col gap-2">
              <FieldLabel
                htmlFor="bookCount"
                className="ml-1 text-base font-bold text-gray-700 md:text-lg"
              >
                도서 수량
              </FieldLabel>

              {/* - [ input ] + 스타일 컨트롤러 */}
              <div className="flex h-12 w-full items-center gap-3 md:h-14">
                <button
                  type="button"
                  onClick={handleDecrement}
                  disabled={updateKid.isPending || newBookCount <= 0}
                  className="flex h-full w-20 shrink-0 items-center justify-center rounded-lg border-2 border-gray-200 bg-white text-2xl font-black text-gray-500 shadow-sm transition-all hover:bg-gray-50 active:scale-95 active:bg-gray-100 disabled:opacity-30 disabled:active:scale-100"
                >
                  -
                </button>

                <input
                  id="bookCount"
                  type="text"
                  inputMode="numeric"
                  className="h-full min-w-0 flex-1 rounded-lg border-2 border-gray-200 bg-white text-center text-xl font-bold text-gray-800 caret-transparent shadow-sm transition-all outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200 disabled:opacity-50"
                  value={newBookCount}
                  onChange={handleBookCountChange}
                  onFocus={moveCursorToEnd}
                  onClick={moveCursorToEnd}
                  disabled={updateKid.isPending}
                />

                <button
                  type="button"
                  onClick={handleIncrement}
                  disabled={updateKid.isPending}
                  className="flex h-full w-20 shrink-0 items-center justify-center rounded-lg border-2 border-gray-200 bg-white text-2xl font-black text-gray-500 shadow-sm transition-all hover:bg-gray-50 active:scale-95 active:bg-gray-100 disabled:opacity-30 disabled:active:scale-100"
                >
                  +
                </button>
              </div>
            </Field>
          </FieldGroup>
        </div>

        <div className="mt-8 flex justify-end gap-8">
          <Button
            type="button"
            variant="outline"
            onClick={handleDelete}
            disabled={updateKid.isPending}
            className="h-14 w-20 rounded-2xl border-2 border-rose-200 bg-rose-50 px-4 text-lg font-bold text-rose-600 transition-all hover:bg-rose-100 hover:text-rose-700 active:translate-y-0.5 md:w-24"
          >
            삭제
          </Button>

          <div className="flex flex-1 gap-2">
            <Button
              variant={"outline"}
              onClick={handleClose}
              disabled={updateKid.isPending}
              className="h-14 w-20 rounded-2xl border-2 border-gray-200 text-lg font-bold text-gray-600 transition-colors hover:bg-gray-100 md:w-24"
            >
              취소
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={updateKid.isPending}
              className="h-14 flex-1 rounded-2xl border-none bg-sky-400 text-lg font-bold text-white shadow-[0_4px_0_0_rgba(14,165,233,1)] transition-all hover:bg-sky-500 active:translate-y-1 active:shadow-none"
            >
              저장
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
