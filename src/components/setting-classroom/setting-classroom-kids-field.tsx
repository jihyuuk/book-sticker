import { LoaderCircle, Plus, Trash2 } from "lucide-react";
import { Field, FieldLabel } from "../ui/field";
import type { Kid } from "@/types/entity-types";
import { Button } from "../ui/button";
import { useOpenAlertModal } from "@/store/alert-modal";
import { toast } from "sonner";
import { useDeleteKid } from "@/hooks/mutations/kid/use-delete-kid";
import { useState } from "react";
import type { KidModalState } from "../modal/kid-modal/kid-form-modal";
import KidFormModal from "../modal/kid-modal/kid-form-modal";
import { cn } from "@/lib/utils";

type KidWithPostCount = Kid & {
  post_count: number;
};

type Props = {
  classroomId: string;
  kids: KidWithPostCount[];
};

export default function SettingClassroomKidsField({
  classroomId,
  kids,
}: Props) {
  //모달
  const openAlertModal = useOpenAlertModal();
  const [kidModal, setKidModal] = useState<KidModalState>(null);

  //뮤테이션
  const deleteKid = useDeleteKid();

  // 삭제 중인 아이 ID 관리
  const [deletingIds, setDeletingIds] = useState<Set<string>>(() => new Set());

  //삭제 상태 변경
  const setDeleting = (id: string, deleting: boolean) => {
    setDeletingIds((prev) => {
      const next = new Set(prev);

      if (deleting) {
        next.add(id);
      } else {
        next.delete(id);
      }

      return next;
    });
  };

  const handleDelete = (id: string) => {
    if (deletingIds.has(id)) return;

    openAlertModal({
      title: "원아를 삭제할까요?",
      description: "작성된 게시글이 모두 삭제되며, 다시 복구할 수 없습니다.",
      actionLabel: "삭제하기",
      actionVariant: "destructive",
      onAction: () => {
        void executeDelete(id);
      },
    });
  };

  const executeDelete = async (id: string) => {
    setDeleting(id, true);

    try {
      await deleteKid.mutateAsync({ kidId: id, classroomId });
      toast.success("삭제 완료");
    } catch {
      toast.error("삭제 실패");
    } finally {
      setDeleting(id, false);
    }
  };

  return (
    <>
      <Field>
        <div className="flex items-center gap-2">
          <FieldLabel>원아 관리</FieldLabel>

          <span className="text-xs text-gray-700">
            <strong className="text-primary">{kids.length}</strong>명
          </span>
        </div>

        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          {kids.map((kid) => {
            const isDeleting = deletingIds.has(kid.id);
            return (
              <div
                key={kid.id}
                className={`flex w-full min-w-0 items-center rounded-md border bg-white transition-colors ${
                  isDeleting
                    ? "pointer-events-none opacity-50"
                    : "hover:bg-gray-50"
                }`}
              >
                {/* 수정 버튼 */}
                <button
                  type="button"
                  onClick={() => setKidModal({ type: "UPDATE", kid })}
                  className="flex min-w-0 flex-1 items-center gap-3 p-3 pr-0 text-left"
                >
                  {/* 프로필 이미지 */}
                  <div
                    className={cn(
                      "size-10 shrink-0 overflow-hidden rounded-full",
                      kid.profile_image_url ? "bg-gray-100" : "bg-sky-100",
                    )}
                  >
                    {kid.profile_image_url ? (
                      <img
                        src={kid.profile_image_url}
                        alt={`${kid.name} 프로필`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-sky-600">
                        {kid.name.slice(0, 1)}
                      </div>
                    )}
                  </div>

                  {/* 아이 정보 */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-base font-semibold text-gray-900">
                      {kid.name}
                    </p>

                    <div className="mt-1 flex flex-wrap gap-1 text-xs text-gray-500">
                      <span>
                        패들렛{" "}
                        <strong className="font-semibold text-gray-700">
                          {kid.book_count}
                        </strong>
                      </span>
                      ·
                      <span>
                        게시글{" "}
                        <strong className="font-semibold text-gray-700">
                          {kid.post_count}
                        </strong>
                      </span>
                    </div>
                  </div>
                </button>

                {/* 삭제 버튼 */}
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => handleDelete(kid.id)}
                  aria-label={`${kid.name} 삭제`}
                  className="shrink-0 p-3"
                >
                  {isDeleting ? (
                    <LoaderCircle className="text-muted-foreground size-5 animate-spin" />
                  ) : (
                    <Trash2 className="text-destructive size-5" />
                  )}
                </button>
              </div>
            );
          })}

          {/* 학생 추가 */}
          <Button
            variant="outline"
            onClick={() => setKidModal({ type: "CREATE" })}
            className="text-muted-foreground flex h-17.5 w-full items-center justify-center gap-1 border border-dashed bg-gray-100"
          >
            <Plus className="size-4" strokeWidth={1.5} />
            원아 등록
          </Button>
        </div>
      </Field>

      <KidFormModal
        classroomId={classroomId}
        mode={kidModal}
        onClose={() => setKidModal(null)}
      />
    </>
  );
}

//zustand삭제 2
//모달 삭제 2
