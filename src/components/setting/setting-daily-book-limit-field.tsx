import { useEffect, useState } from "react";
import { toast } from "sonner";

import { useUpdateSetting } from "@/hooks/mutations/setting/use-update-setting";

import { Button } from "../ui/button";
import { Field, FieldDescription, FieldLabel } from "../ui/field";
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
    <Field className="w-full px-4 py-5">
      <FieldLabel className="text-sm font-semibold">차트 설정</FieldLabel>

      <div className="flex gap-2">
        <Input
          inputMode="numeric"
          pattern="[0-9]*"
          className="h-12 flex-1 px-4 text-sm"
          value={dailyBookLimit}
          onChange={handleDailyBookLimitChange}
          disabled={isUpdating}
        />

        <Button
          type="button"
          onClick={handleUpdateClick}
          className="h-12 shrink-0 bg-sky-500 px-5 font-semibold text-white hover:bg-sky-600"
          disabled={!canSubmit}
        >
          저장
        </Button>
      </div>

      <FieldDescription className="pl-1 text-xs text-gray-400">
        하루 최대 인정 독서 수
      </FieldDescription>
    </Field>
  );
}
