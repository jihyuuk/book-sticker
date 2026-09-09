import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useVerifyPostPassword } from "@/hooks/mutations/post/use-verify-post-password";

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
        onError: () => {
          setPassword("");
          toast.error("비밀번호가 올바르지 않습니다.");
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>비밀번호</DialogTitle>
        </DialogHeader>

        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호를 입력해주세요"
          disabled={isPending}
        />

        <Button onClick={handleConfirm} disabled={!password || isPending}>
          {isPending ? "확인 중..." : "확인"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
