import { useEffect, useState } from "react";
import { toast } from "sonner";

import { useUpdateSetting } from "@/hooks/mutations/setting/use-update-setting";

import { Button } from "../ui/button";
import { Field, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";

type Props = {
  oriDailyBookLimit: number;
};

export default function SettingDailyBookLimitField({
  oriDailyBookLimit,
}: Props) {
  const [dailyBookLimit, setDailyBookLimit] = useState(
    String(oriDailyBookLimit),
  );

  const { mutate, isPending: isUpdating } = useUpdateSetting();

  useEffect(() => {
    setDailyBookLimit(String(oriDailyBookLimit));
  }, [oriDailyBookLimit]);

  const dailyBookLimitNumber = Number(dailyBookLimit);

  const canSubmit =
    dailyBookLimit.length > 0 &&
    dailyBookLimitNumber >= 1 &&
    dailyBookLimitNumber !== oriDailyBookLimit &&
    !isUpdating;

  const handleDailyBookLimitChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;

    // 숫자만 허용
    if (!/^\d*$/.test(value)) return;

    setDailyBookLimit(value);
  };

  const handleUpdateClick = () => {
    if (!canSubmit) return;

    mutate(
      {
        daily_book_limit: dailyBookLimitNumber,
      },
      {
        onSuccess: () => {
          toast.success("차트 설정이 변경되었습니다.");
        },
        onError: () => {
          toast.error("차트 설정 변경에 실패했습니다.");
        },
      },
    );
  };

  return (
    <Field className="w-full">
      <FieldLabel>일일 게시글 작성 한도</FieldLabel>

      <div className="flex gap-2">
        <Input
          inputMode="numeric"
          pattern="[0-9]*"
          value={dailyBookLimit}
          onChange={handleDailyBookLimitChange}
          disabled={isUpdating}
        />

        <Button onClick={handleUpdateClick} disabled={!canSubmit}>
          저장
        </Button>
      </div>
    </Field>
  );
}
