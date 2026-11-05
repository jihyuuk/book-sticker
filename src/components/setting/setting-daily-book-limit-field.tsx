import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";

import { useUpdateAccountSetting } from "@/hooks/mutations/setting/use-update-account-setting";

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

  const { mutate, isPending: isUpdating } = useUpdateAccountSetting();

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

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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
    <form onSubmit={handleSubmit}>
      <Field className="w-full">
        <FieldLabel htmlFor="daily-book-limit">
          일일 게시글 작성 한도
        </FieldLabel>

        <div className="flex min-w-0 gap-2">
          <NumberInput
            id="daily-book-limit"
            className="min-w-0 flex-1"
            placeholder="일일 게시글 작성 한도를 입력해주세요"
            value={dailyBookLimit}
            onValueChange={setDailyBookLimit}
            disabled={isUpdating}
            maxLength={5}
            aria-invalid={Number(dailyBookLimit) < 1}
            removeLeadingZeros
          />

          <Button type="submit" className="shrink-0" disabled={!canSubmit}>
            {isUpdating ? <Loader2 className="animate-spin" /> : "수정"}
          </Button>
        </div>
      </Field>
    </form>
  );
}
