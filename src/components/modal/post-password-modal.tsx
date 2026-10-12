import { toast } from "sonner";
import { Dialog, DialogContent } from "../ui/dialog";
import { useState } from "react";
import { Button } from "../ui/button";
import { useVerifyPostPassword } from "@/hooks/mutations/post/use-verify-post-password";
import { Field, FieldLabel } from "../ui/field";
import { FunctionsHttpError } from "@supabase/supabase-js";
import PasswordInput from "../ui/password-input";
import { Loader2 } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  postId: string;
  onVerified: (password: string) => void;
};

export default function PostPasswordModal({
  open,
  onOpenChange,
  postId,
  onVerified,
}: Props) {
  const [password, setPassword] = useState("");

  const { mutate: verifyPassword, isPending } = useVerifyPostPassword();

  const handleConfirm = () => {
    if (!password) return;

    verifyPassword(
      {
        postId,
        password,
      },
      {
        onSuccess: () => {
          setPassword("");
          onOpenChange(false);
          onVerified(password);
        },
        onError: (error) => {
          if (
            error instanceof FunctionsHttpError &&
            error.context.status === 401
          ) {
            setPassword("");
            toast.error("비밀번호가 올바르지 않습니다.");
            return;
          }

          toast.error("오류가 발생했습니다.");
        },
      },
    );
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (isPending) return;

    onOpenChange(nextOpen);

    if (!nextOpen) {
      setPassword("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="rounded-lg p-5! pb-4.5! shadow-xl sm:max-w-md"
        onOpenAutoFocus={(e) => {
          e.preventDefault();
        }}
      >
        {/* 비밀번호 */}
        <Field>
          <FieldLabel
            htmlFor="password"
            className="text-headline-5 mb-1 font-semibold"
          >
            비밀번호
          </FieldLabel>

          <PasswordInput
            id="password"
            autoComplete="off"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            placeholder="비밀번호 입력"
            disabled={isPending}
          />
        </Field>

        <Button
          size="lg"
          onClick={handleConfirm}
          disabled={!password || isPending}
          className="mt-3 flex-1 rounded-md"
        >
          {isPending ? <Loader2 className="animate-spin" /> : "확인"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
