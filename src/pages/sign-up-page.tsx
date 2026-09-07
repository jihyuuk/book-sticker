import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSignUp } from "@/hooks/mutations/auth/use-sign-up";
import { VERIFICATION_EMAIL } from "@/lib/session-storage";
import { generateErrorMessage } from "@/lib/supabse-error";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";

type InvalidType = "EMAIL" | "PASSWORD" | "PASSWORD_CONFIRM" | null;

export default function SignUpPage() {
  const navigate = useNavigate();
  const { mutate: signUp, isPending } = useSignUp();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [invalidType, setInvalidType] = useState<InvalidType>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setInvalidType(null);

    if (!email.trim()) {
      toast.error("이메일을 입력해주세요.");
      setInvalidType("EMAIL");
      return;
    }

    if (!password) {
      toast.error("비밀번호를 입력해주세요.");
      setInvalidType("PASSWORD");
      return;
    }

    if (password.length < 6) {
      toast.error("비밀번호는 6자 이상 입력해주세요.");
      setInvalidType("PASSWORD");
      return;
    }

    if (password !== passwordConfirm) {
      toast.error("비밀번호가 다릅니다.");
      setInvalidType("PASSWORD_CONFIRM");
      return;
    }

    //api 호출
    signUp(
      {
        email: email.trim(),
        password,
      },
      {
        onSuccess: () => {
          sessionStorage.setItem(VERIFICATION_EMAIL, email.trim());
          toast.success("인증 이메일을 보냈습니다.");
          navigate("/verify-email", { replace: true });
        },
        onError: (error) => {
          const message = generateErrorMessage(error);
          toast.error(message);
          setPassword("");
          setPasswordConfirm("");
        },
      },
    );
  };

  return (
    <div className="flex min-h-dvh items-center justify-center p-4">
      {/* 카드 */}
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-md flex-col gap-3 rounded-2xl bg-white p-6 shadow-md"
      >
        <div className="mb-4">
          <h1 className="text-2xl font-semibold">회원 가입</h1>
          <p className="mt-1 text-sm text-stone-500">
            독서 기록을 시작해보세요.
          </p>
        </div>

        <Input
          type="email"
          className="h-12 px-4"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isPending}
          aria-invalid={invalidType === "EMAIL"}
        />

        <Input
          type="password"
          className="h-12 px-4"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isPending}
          aria-invalid={invalidType === "PASSWORD"}
        />

        <Input
          type="password"
          className="h-12 px-4"
          placeholder="비밀번호 확인"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          disabled={isPending}
          aria-invalid={invalidType === "PASSWORD_CONFIRM"}
        />

        <Button
          type="submit"
          className="mt-4 h-12 font-semibold"
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : (
            "가입하기"
          )}
        </Button>

        <div className="text-muted-foreground text-sm">
          계정이 이미 있다면?
          <Link
            className="text-muted-foreground ml-2 underline hover:text-sky-600"
            to={"/sign-in"}
          >
            로그인
          </Link>
        </div>
      </form>
    </div>
  );
}
