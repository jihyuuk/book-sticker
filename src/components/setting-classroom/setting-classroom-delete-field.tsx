import { useOpenAlertModal } from "@/store/alert-modal";
import { Button } from "../ui/button";
import { Field, FieldLabel } from "../ui/field";
import { useDeleteClassroom } from "@/hooks/mutations/classroom/use-delete-classroom";
import { toast } from "sonner";
import { useNavigate } from "react-router";

type Props = {
  classroomId: string;
};

export default function SettingClassroomDeleteField({ classroomId }: Props) {
  const navigate = useNavigate();

  const openAlertModal = useOpenAlertModal();
  const { mutateAsync: deleteClassroom } = useDeleteClassroom();

  const handleDelete = () => {
    openAlertModal({
      title: "반을 삭제할까요?",
      description: "반에 등록된 모든 원아들과 게시글이 함께 삭제됩니다.",
      actionLabel: "삭제하기",
      actionVariant: "destructive",
      onAction: async () => {
        await deleteClassroom(classroomId, {
          onSuccess: () => {
            toast.success("반이 삭제되었습니다.");
            navigate("/setting", {
              replace: true,
            });
          },
          onError: () => {
            toast.error("반 삭제에 실패했습니다.");
          },
        });
      },
    });
  };

  return (
    <Field>
      <FieldLabel>기타</FieldLabel>

      <Button
        onClick={handleDelete}
        variant="outline"
        className="border-rose-200 bg-rose-50 font-semibold text-rose-600 hover:bg-rose-100 hover:text-rose-700"
      >
        반 삭제하기
      </Button>
    </Field>
  );
}
