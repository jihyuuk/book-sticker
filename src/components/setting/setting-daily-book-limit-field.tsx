import { useEffect, useState } from "react";
import { toast } from "sonner";

import { useUpdateSetting } from "@/hooks/mutations/setting/use-update-setting";

import { Button } from "../ui/button";
import { Field, FieldLabel } from "../ui/field";
import { Loader2 } from "lucide-react";
import NumberInput from "../ui/number-input";

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
    dailyBookLimitNumber <= 99999 &&
    dailyBookLimitNumber !== oriDailyBookLimit &&
    !isUpdating;

  const handleUpdateClick = () => {
    if (!canSubmit) return;

    mutate(
      {
        daily_book_limit: dailyBookLimitNumber,
      },
      {
        onSuccess: () => {
          toast.success("게시글 작성 한도가 변경되었습니다.");
        },
        onError: () => {
          toast.error("게시글 작성 한도 변경에 실패했습니다.");
        },
      },
    );
  };

  return (
    <Field className="w-full">
      <FieldLabel>일일 게시글 작성 한도</FieldLabel>

      <div className="flex gap-2">
        <NumberInput
          placeholder="일일 게시글 작성 한도를 입력해주세요"
          value={dailyBookLimit}
          onValueChange={setDailyBookLimit}
          disabled={isUpdating}
          maxLength={5}
          aria-invalid={Number(dailyBookLimit) < 1}
        />

        <Button onClick={handleUpdateClick} disabled={!canSubmit}>
          {isUpdating ? <Loader2 className="animate-spin" /> : "수정"}
        </Button>
      </div>
    </Field>
  );
}
