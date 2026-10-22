import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";
import { useAlertModal } from "@/store/alert-modal";
import { Button } from "../ui/button";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function AlertModal() {
  const store = useAlertModal();
  const [isProcessing, setIsProcessing] = useState(false);

  if (!store.isOpen) return null;

  const handleCancelClick = () => {
    if (isProcessing) return;

    store.onCancel?.();
    store.actions.close();
  };

  const handleActionClick = async () => {
    if (isProcessing) return;

    setIsProcessing(true);

    try {
      // 비동기 작업이 끝날 때까지 대기
      await store.onAction?.();
      // 성공하면 모달 닫기
      store.actions.close();
    } catch {
      // 에러 알림은 mutation의 onError에서 처리
      return;
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AlertDialog open={store.isOpen}>
      <AlertDialogContent
        className="rounded-lg p-5! pb-4.5! shadow-xl sm:max-w-md"
        onEscapeKeyDown={(e) => {
          if (isProcessing) e.preventDefault();
        }}
      >
        <header>
          <h1 className="text-headline-5 font-semibold">{store.title}</h1>
          <p className="text-body-2 text-muted-foreground mt-1.5">
            {store.description}
          </p>
        </header>

        <div className="mt-3 flex gap-2">
          {store.showCancel !== false && (
            <Button
              size="lg"
              className="flex-1 rounded-md"
              onClick={handleCancelClick}
              variant={"outline"}
              disabled={isProcessing}
            >
              취소
            </Button>
          )}
          <Button
            size="lg"
            variant={store.actionVariant ?? "default"}
            onClick={handleActionClick}
            className="flex-1 rounded-md"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="animate-spin" />
              </>
            ) : (
              (store.actionLabel ?? "확인")
            )}
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
