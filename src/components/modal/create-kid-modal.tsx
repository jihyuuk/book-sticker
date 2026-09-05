import { useEffect, useState, type ChangeEvent } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { useCreateKid } from "@/hooks/mutations/kid/use-create-kid";
import { useCreateKidModalStore } from "@/store/create-kid-modal-store";
import { useOpenAlertModal } from "@/store/alert-modal";
import { toast } from "sonner";
import { useClassroom } from "@/hooks/queries/use-classroom";

export default function CreateKidModal() {
  const modal = useCreateKidModalStore();
  const { data: classroom } = useClassroom();
  const openAlertModal = useOpenAlertModal();

  const createKid = useCreateKid();
  const [name, setName] = useState("");
  const [bookCount, setBookCount] = useState(0);

  useEffect(() => {
    if (!modal.isOpen) return;
    setName("");
    setBookCount(0);
  }, [modal.isOpen]);

  const handleClose = () => {
    if (createKid.isPending || !modal.isOpen) return;

    if (name.trim() || bookCount !== 0) {
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
    if (!name.trim()) {
      toast.warning("이름은 필수 입니다.");
      setName(name.trim());
      return;
    }

    if (!classroom) {
      toast.warning("잠시 후 다시 시도해주세요.");
      return;
    }

    // 필요시 bookCount도 mutate 파라미터에 추가하세요.
    createKid.mutate(
      {
        classroom_id: classroom.id,
        name: name.trim(),
        book_count: bookCount,
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

  const handleBookCountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value.replace(/\D/g, ""));
    setBookCount(value);
  };

  const handleIncrement = () => setBookCount((prev) => prev + 1);
  const handleDecrement = () =>
    setBookCount((prev) => (prev > 0 ? prev - 1 : 0));

  const moveCursorToEnd = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const end = input.value.length;

    input.setSelectionRange(end, end);
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
            어린이 추가
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
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={createKid.isPending}
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
                  disabled={createKid.isPending || bookCount <= 0}
                  className="flex h-full w-20 shrink-0 items-center justify-center rounded-lg border-2 border-gray-200 bg-white text-2xl font-black text-gray-500 shadow-sm transition-all hover:bg-gray-50 active:scale-95 active:bg-gray-100 disabled:opacity-30 disabled:active:scale-100"
                >
                  -
                </button>

                <input
                  id="bookCount"
                  type="text"
                  inputMode="numeric"
                  className="h-full min-w-0 flex-1 rounded-lg border-2 border-gray-200 bg-white text-center text-xl font-bold text-gray-800 caret-transparent shadow-sm transition-all outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200 disabled:opacity-50"
                  value={bookCount}
                  onChange={handleBookCountChange}
                  onFocus={moveCursorToEnd}
                  onClick={moveCursorToEnd}
                  disabled={createKid.isPending}
                />

                <button
                  type="button"
                  onClick={handleIncrement}
                  disabled={createKid.isPending}
                  className="flex h-full w-20 shrink-0 items-center justify-center rounded-lg border-2 border-gray-200 bg-white text-2xl font-black text-gray-500 shadow-sm transition-all hover:bg-gray-50 active:scale-95 active:bg-gray-100 disabled:opacity-30 disabled:active:scale-100"
                >
                  +
                </button>
              </div>
            </Field>
          </FieldGroup>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <Button
            variant={"outline"}
            onClick={handleClose}
            disabled={createKid.isPending}
            className="h-14 flex-1 rounded-2xl border-2 border-gray-200 text-lg font-bold text-gray-600 transition-colors hover:bg-gray-100"
          >
            취소
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={createKid.isPending}
            className="h-14 flex-1 rounded-2xl border-none bg-sky-400 text-lg font-bold text-white shadow-[0_4px_0_0_rgba(14,165,233,1)] transition-all hover:bg-sky-500 active:translate-y-1 active:shadow-none"
          >
            저장
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
