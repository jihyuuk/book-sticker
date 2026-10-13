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
    <Field>
      <FieldLabel>공유 링크</FieldLabel>

      <div className="flex gap-2">
        <div className="relative min-w-0 flex-1">
          <Input
            value={publicUrl}
            readOnly
            className="pr-10"
            onFocus={(e) => e.currentTarget.select()}
          />

          <button
            type="button"
            onClick={handleCopy}
            aria-label="링크 복사"
            title="링크 복사"
            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2 flex size-8 -translate-y-1/2 items-center justify-center rounded-md transition-colors"
          >
            <Copy className="size-4" />
          </button>
        </div>

        <Button type="button" onClick={handleShare} className="min-w-0">
          <Share2 className="size-4" />
        </Button>
      </div>

      <FieldDescription className="pl-1 text-xs text-gray-400">
        학부모에게 전달하는 공개 페이지 주소입니다.
      </FieldDescription>
    </Field>
  );
}
