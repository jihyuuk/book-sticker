import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSignUp } from "@/hooks/mutations/use-sign-up";
import { generateErrorMessage } from "@/lib/supabse-error";
import { useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { mutate: signIn, isPending, isError } = useSignUp();

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
          <h1 className="text-2xl font-semibold">회원가입</h1>
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
          {isPending ? "회원 가입 중..." : "회원가입"}
        </Button>

        <Link to={"/sign-in"}>회원가입 이동</Link>
      </div>
    </main>
  );
}
