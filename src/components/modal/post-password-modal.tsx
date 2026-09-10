import { toast } from "sonner";
import { Dialog, DialogContent } from "../ui/dialog";
import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useVerifyPostPassword } from "@/hooks/mutations/post/use-verify-post-password";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { FunctionsHttpError } from "@supabase/supabase-js";

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
  const [isInvalid, setIsInvalid] = useState(false);

  const { mutate: verifyPassword, isPending } = useVerifyPostPassword();

  const handleConfirm = () => {
    if (!password) return;

    setIsInvalid(false);

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
            setIsInvalid(true);
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
      setIsInvalid(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="rounded-3xl border-4 border-gray-100 p-6 shadow-xl sm:max-w-md"
        onOpenAutoFocus={(e) => {
          e.preventDefault();
        }}
      >
        <div className="mt-2">
          <FieldGroup className="mt-2 md:space-y-5">
            <Field className="flex flex-col gap-2">
              <FieldLabel
                htmlFor="password"
                className="ml-1 text-base font-bold text-gray-700 md:text-lg"
              >
                비밀번호
              </FieldLabel>
              <Input
                id="password"
                type="password"
                value={password}
                autoComplete="off"
                placeholder="비밀번호를 입력해주세요"
                disabled={isPending}
                className="h-12 rounded-2xl border-2 border-gray-200 px-4 text-base transition-all focus-visible:border-sky-400 focus-visible:ring-sky-200 md:h-14 md:text-lg"
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={isInvalid}
              />
            </Field>
          </FieldGroup>
        </div>

        <Button
          onClick={handleConfirm}
          disabled={!password || isPending}
          className="mt-3 h-12 flex-1 rounded-2xl border-none bg-sky-400 text-lg font-bold text-white shadow-[0_4px_0_0_rgba(14,165,233,1)] transition-all hover:bg-sky-500 active:translate-y-1 active:shadow-none"
        >
          {isPending ? "확인 중..." : "확인"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
