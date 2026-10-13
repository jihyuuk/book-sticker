import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Field, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { useUpdateSetting } from "@/hooks/mutations/setting/use-update-setting";

type Props = {
  oriName: string;
};

export default function SettingNameField({ oriName }: Props) {
  const [name, setName] = useState(oriName);

  const { mutate, isPending: isUpdating } = useUpdateSetting();

  useEffect(() => {
    setName(oriName);
  }, [oriName]);

  const trimmedName = name.trim();
  const canSubmit =
    trimmedName.length > 0 && trimmedName !== oriName && !isUpdating;

  const handleNameUpdateClick = () => {
    if (!canSubmit) return;

    mutate(
      { name: trimmedName },
      {
        onSuccess: () => {
          toast.success("유치원명이 변경되었습니다.");
        },
        onError: () => {
          toast.error("유치원명 변경에 실패했습니다.");
        },
      },
    );
  };

  return (
    <Field>
      <FieldLabel>유치원명</FieldLabel>

      <div className="flex gap-2">
        <Input
          placeholder="유치원명을 입력해주세요"
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
