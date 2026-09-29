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
    <Field className="w-full px-4 py-5">
      <FieldLabel className="text-sm font-semibold">유치원명</FieldLabel>

      <div className="flex gap-2">
        <Input
          placeholder="유치원명을 입력해주세요"
          className="h-12 flex-1 px-4 text-sm"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isUpdating}
        />

        <Button
          type="button"
          onClick={handleNameUpdateClick}
          className="h-12 shrink-0 bg-sky-500 px-5 font-semibold text-white hover:bg-sky-600"
          disabled={!canSubmit}
        >
          저장
        </Button>
      </div>
    </Field>
  );
}
