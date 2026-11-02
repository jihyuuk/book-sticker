import { Check, Copy, Share2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "../ui/button";
import { Field, FieldDescription, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { useEffect, useRef, useState } from "react";

type Props = {
  publicUrl: string;
};

export default function SettingClassroomPublicLinkField({ publicUrl }: Props) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);

      setCopied(true);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
        setCopied(false);
        timeoutRef.current = null;
      }, 3000);
    } catch {
      toast.error("링크 복사에 실패했어요.");
    }
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
            aria-label={copied ? "복사 완료" : "링크 복사"}
            title={copied ? "복사 완료" : "링크 복사"}
            className={`absolute top-1/2 right-2 flex size-8 -translate-y-1/2 items-center justify-center rounded-md transition-colors ${
              copied
                ? "text-green-600"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="relative size-4">
              <Copy
                className={`absolute inset-0 size-4 transition-all duration-200 ${
                  copied ? "scale-50 opacity-0" : "scale-100 opacity-100"
                }`}
              />
              <Check
                className={`absolute inset-0 size-4 transition-all duration-200 ${
                  copied ? "scale-100 opacity-100" : "scale-50 opacity-0"
                }`}
              />
            </span>
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
