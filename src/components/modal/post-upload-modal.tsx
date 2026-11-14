import { AlertCircle, CheckCircle2, LoaderCircle } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { UploadPhase } from "@/lib/media/upload-post-media";

type Phase = UploadPhase | "SAVING" | "COMPLETED";

export type UploadingFile = {
  id: string;
  label: string;
};

type Props = {
  open: boolean;
  phase: Phase;
  files: UploadingFile[];
  progress: Record<string, number>;
  failed?: boolean;
  onDismissError?: () => void;
  mode?: "CREATE" | "UPDATE";
};

export default function PostUploadModal({
  open,
  phase,
  files,
  progress,
  failed = false,
  onDismissError,
  mode = "CREATE",
}: Props) {
  const action = mode === "UPDATE" ? "수정" : "저장";

  const hasFiles = files.length > 0;
  const isCompleted = phase === "COMPLETED";
  const isSaving = phase === "SAVING" || (!hasFiles && !isCompleted);
  const showUploadList = hasFiles && !isSaving && !isCompleted;

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        showCloseButton={false}
        onOpenAutoFocus={(event) => event.preventDefault()}
        onPointerDownOutside={(event) => event.preventDefault()}
        onEscapeKeyDown={(event) => event.preventDefault()}
        aria-describedby={undefined}
        className="w-[calc(100%-40px)] max-w-sm gap-0 rounded-2xl p-5 shadow-xl sm:max-w-sm"
      >
        <DialogTitle
          className={
            failed && showUploadList
              ? "text-destructive text-center text-base font-semibold"
              : "sr-only"
          }
        >
          {failed && showUploadList ? "업로드 실패" : "게시글 처리 중"}
        </DialogTitle>

        {/* 파일 업로드 */}
        {showUploadList && (
          <div
            className={`max-h-[60dvh] space-y-5 overflow-y-auto ${
              failed ? "mt-5" : ""
            }`}
          >
            {files.map((file) => {
              const value = Math.max(0, Math.min(100, progress[file.id] ?? 0));
              const incomplete = failed && value < 100;

              return (
                <div key={file.id} className="space-y-2">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="min-w-0 truncate font-medium">
                      {file.label}
                    </span>

                    <div className="flex shrink-0 items-center gap-2">
                      <span className="text-muted-foreground tabular-nums">
                        {value}%
                      </span>
                    </div>
                  </div>

                  <div className="bg-muted h-1.5 overflow-hidden rounded-full">
                    <div
                      className={`h-full rounded-full transition-[width] duration-150 ${
                        incomplete ? "bg-destructive" : "bg-sky-500"
                      }`}
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 저장 중 / 저장 실패 / 완료 */}
        {!showUploadList && (
          <div className="flex flex-col items-center justify-center gap-4 py-8">
            {failed ? (
              <AlertCircle className="text-destructive size-10" />
            ) : isCompleted ? (
              <CheckCircle2 className="size-10 text-sky-500" />
            ) : (
              <LoaderCircle className="size-9 animate-spin text-sky-500" />
            )}

            <span
              className={`text-sm font-medium ${
                failed ? "text-destructive" : ""
              }`}
            >
              {failed
                ? `${action} 실패`
                : isCompleted
                  ? `${action} 완료`
                  : `${action} 중...`}
            </span>
          </div>
        )}

        {/* 닫기 */}
        {failed && (
          <button
            type="button"
            className="text-muted-foreground mt-5 self-end text-sm underline-offset-4 hover:underline"
            onClick={onDismissError}
          >
            닫기
          </button>
        )}
      </DialogContent>
    </Dialog>
  );
}
