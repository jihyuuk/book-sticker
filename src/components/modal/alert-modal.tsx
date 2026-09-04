import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAlertModal } from "@/store/alert-modal";
import { Button } from "../ui/button";

export default function AlertModal() {
  const store = useAlertModal();
  if (!store.isOpen) return null;

  const handleCancelClick = () => {
    if (store.onCancel) store.onCancel();
    store.actions.close();
  };

  const handleActionClick = () => {
    if (store.onAction) store.onAction();
    store.actions.close();
  };

  return (
    <AlertDialog open={store.isOpen}>
      <AlertDialogContent className="rounded-3xl border-4 border-gray-100 p-6 shadow-xl sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-bold text-gray-800">
            {store.title}
          </AlertDialogTitle>
          <AlertDialogDescription>{store.description}</AlertDialogDescription>
        </AlertDialogHeader>

        <div className="mt-2 flex justify-end gap-3">
          <Button
            variant={"outline"}
            onClick={handleCancelClick}
            className="h-14 flex-1 rounded-2xl border-2 border-gray-200 text-lg font-bold text-gray-600 transition-colors hover:bg-gray-100"
          >
            취소
          </Button>
          <Button
            onClick={handleActionClick}
            className="h-14 flex-1 rounded-2xl border-none bg-sky-400 text-lg font-bold text-white shadow-[0_4px_0_0_rgba(14,165,233,1)] transition-all hover:bg-sky-500 active:translate-y-1 active:shadow-none"
          >
            확인
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
