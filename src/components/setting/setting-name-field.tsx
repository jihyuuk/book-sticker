import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Field, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { useUpdateAccountSetting } from "@/hooks/mutations/setting/use-update-account-setting";
import { Loader2 } from "lucide-react";

type Props = {
  oriName: string;
};

export default function SettingNameField({ oriName }: Props) {
  const [name, setName] = useState(oriName);

  const { mutate, isPending: isUpdating } = useUpdateAccountSetting();

  useEffect(() => {
    setName(oriName);
  }, [oriName]);

  const trimmedName = name.trim();
  const canSubmit =
    trimmedName.length > 0 && trimmedName !== oriName && !isUpdating;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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
    <form onSubmit={handleSubmit}>
      <Field>
        <FieldLabel htmlFor="kindergarten-name">유치원명</FieldLabel>

        <div className="flex gap-2">
          <Input
            id="kindergarten-name"
            placeholder="유치원명을 입력해주세요"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isUpdating}
            aria-invalid={!trimmedName}
          />

          <Button type="submit" disabled={!canSubmit}>
            {isUpdating ? <Loader2 className="animate-spin" /> : "수정"}
          </Button>
        </div>
      </Field>
    </form>
  );
}
