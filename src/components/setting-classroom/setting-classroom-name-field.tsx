import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Field, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useParams } from "react-router";
import { useUpdateClassroom } from "@/hooks/mutations/classroom/use-update-classroom";

type Props = {
  oriName: string;
};

export default function SettingClassroomNameField({ oriName }: Props) {
  const { classroomId } = useParams();
  const [name, setName] = useState(oriName);

  const { mutate, isPending: isUpdating } = useUpdateClassroom();

  useEffect(() => {
    setName(oriName);
  }, [oriName]);

  const trimmedName = name.trim();
  const canSubmit =
    trimmedName.length > 0 && trimmedName !== oriName && !isUpdating;

  const handleNameUpdateClick = () => {
    if (!canSubmit || !classroomId) return;

    mutate(
      {
        id: classroomId,
        name: trimmedName,
      },
      {
        onSuccess: () => {
          toast.success("반 이름이 변경되었습니다.");
        },
        onError: () => {
          toast.error("반 이름 변경에 실패했습니다.");
        },
      },
    );
  };

  return (
    <Field>
      <FieldLabel>반 이름</FieldLabel>

      <div className="flex gap-2">
        <Input
          placeholder="반 이름을 입력해주세요"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isUpdating}
        />

        <Button onClick={handleNameUpdateClick} disabled={!canSubmit}>
          저장
        </Button>
      </div>
    </Field>
  );
}
