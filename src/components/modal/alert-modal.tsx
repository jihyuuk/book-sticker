import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";
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
      <AlertDialogContent className="rounded-lg p-5! pb-4.5! shadow-xl sm:max-w-md">
        <header>
          <h1 className="text-headline-5 font-semibold">{store.title}</h1>
          <p className="text-body-2 text-muted-foreground mt-1.5">
            {store.description}
          </p>
        </header>

        <div className="mt-3 flex gap-2">
          <Button
            size="lg"
            className="flex-1 rounded-md"
            onClick={handleCancelClick}
            variant={"outline"}
          >
            취소
          </Button>
          <Button
            size="lg"
            variant={store.actionVariant ?? "default"}
            onClick={handleActionClick}
            className="flex-1 rounded-md"
          >
            {store.actionLabel ?? "확인"}
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
