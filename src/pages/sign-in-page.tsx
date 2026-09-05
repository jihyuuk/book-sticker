import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSignIn } from "@/hooks/mutations/auth/use-sign-in";
import { generateErrorMessage } from "@/lib/supabse-error";
import { useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { mutate: signIn, isPending, isError } = useSignIn();

  const handleSubmit = () => {
    signIn(
      {
        email,
        password,
      },
      {
        onError: (error) => {
          const message = generateErrorMessage(error);
          toast.error(message);
          setPassword("");
        },
      },
    );
  };

  return (
    <main className="flex min-h-dvh items-center justify-center p-4">
      <div className="flex w-full max-w-sm flex-col gap-4">
        <div>
          <h1 className="text-2xl font-semibold">로그인</h1>
          <p className="mt-1 text-sm text-stone-500">
            우리 반 독서 기록을 관리해보세요.
          </p>
        </div>

        <Input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {isError && (
          <p className="text-sm text-red-500">
            이메일 또는 비밀번호를 확인해주세요.
          </p>
        )}

        <Button onClick={handleSubmit} disabled={isPending}>
          {isPending ? "로그인 중..." : "로그인"}
        </Button>

        <Link to={"/sign-up"}>회원가입 이동</Link>
      </div>
    </main>
  );
}
