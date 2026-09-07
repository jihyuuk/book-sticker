import { Button } from "@/components/ui/button";
import { useResendVerificationEmail } from "@/hooks/mutations/auth/use-resend-verification-email";
import { VERIFICATION_EMAIL } from "@/lib/session-storage";
import { MailCheckIcon } from "lucide-react";
import { Navigate, useNavigate } from "react-router";
import { toast } from "sonner";

export default function VerifyEmailPage() {
  const navigate = useNavigate();

  const { mutate: resend, isPending: isResending } =
    useResendVerificationEmail();

  const email = sessionStorage.getItem(VERIFICATION_EMAIL)?.trim();

  const handleResend = () => {
    if (!email) return;

    resend(email, {
      onSuccess: () => {
        toast.success("인증 이메일을 다시 보냈습니다.");
      },
      onError: () => {
        toast.error("인증 이메일 재전송에 실패했습니다.");
      },
    });
  };

  const handleMoveToLogin = () => {
    sessionStorage.removeItem(VERIFICATION_EMAIL);
    navigate("/sign-in", { replace: true });
  };

  if (!email) {
    return <Navigate to="/sign-in" replace />;
  }

  return (
    <main className="flex min-h-dvh items-center justify-center p-4">
      {/* 카드 */}
      <div className="flex w-full max-w-md flex-col items-center gap-3 rounded-2xl bg-white p-6 shadow-md">
        <div className="mt-2 mb-4 flex size-16 items-center justify-center rounded-full bg-emerald-50">
          <MailCheckIcon className="size-8 text-emerald-600" />
        </div>

        <h1 className="text-2xl font-bold">이메일을 확인해주세요</h1>

        <div className="text-foreground mt-3 text-sm font-medium">{email}</div>
        <div className="text-muted-foreground mt-1 text-sm">
          위 이메일로 인증 링크를 보냈습니다.
        </div>

        <div className="mt-8 flex w-full flex-col gap-2">
          <Button
            variant="outline"
            className="h-12 font-semibold"
            onClick={handleResend}
            disabled={isResending}
          >
            {isResending ? "전송 중..." : "인증 이메일 다시 보내기"}
          </Button>

          <Button
            className="h-12 font-semibold"
            onClick={handleMoveToLogin}
            disabled={isResending}
          >
            로그인하기
          </Button>
        </div>
      </div>
    </main>
  );
}
