import { Copy, Share2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "../ui/button";
import { Field, FieldDescription, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";

type Props = {
  publicUrl: string;
};

export default function SettingClassroomPublicLinkField({ publicUrl }: Props) {
  const handleCopy = async () => {
    await navigator.clipboard.writeText(publicUrl);
    toast.success("공유 링크를 복사했어요.");
  };

  const handleShare = async () => {
    const shareData = {
      // title: "우리 반 독서 기록",
      // text: "우리 반 독서 기록을 확인해보세요.",
      url: publicUrl,
    };

    try {
      if (
        navigator.share &&
        (!navigator.canShare || navigator.canShare(shareData))
      ) {
        await navigator.share(shareData);
        return;
      }
    } catch (err) {
      console.log("공유 실패:", err);
    }
  };

  return (
    <Field className="w-full px-4 py-5">
      <FieldLabel className="text-sm font-semibold">공유 링크</FieldLabel>

      <div className="flex gap-2">
        <Input
          value={publicUrl}
          readOnly
          onFocus={(e) => e.currentTarget.select()}
          className="h-12 min-w-0 flex-1 bg-gray-50 px-4 text-sm text-gray-600"
        />

        <Button
          type="button"
          variant="outline"
          onClick={handleCopy}
          className="h-12 shrink-0 px-4"
        >
          <Copy className="size-4" />
          {/* 복사 */}
        </Button>

        <Button
          type="button"
          onClick={handleShare}
          className="h-12 shrink-0 bg-sky-500 px-4 font-semibold text-white hover:bg-sky-600"
        >
          <Share2 className="size-4" />
          {/* 공유 */}
        </Button>
      </div>

      <FieldDescription className="pl-1 text-xs text-gray-400">
        학부모에게 공유할 반 공개 페이지 주소입니다.
      </FieldDescription>
    </Field>
  );
}
