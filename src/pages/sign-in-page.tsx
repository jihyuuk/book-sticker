import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSignIn } from "@/hooks/mutations/auth/use-sign-in";
import { generateErrorMessage } from "@/lib/supabse-error";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";

type InvalidType = "EMAIL" | "PASSWORD" | null;

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [invalidType, setInvalidType] = useState<InvalidType>(null);

  const { mutate: signIn, isPending } = useSignIn();

  const handleSubmit = () => {
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

    //api 호출
    signIn(
      {
        email: email.trim(),
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
    <div className="flex min-h-dvh items-center justify-center p-4">
      {/* 카드 */}
      <div className="flex w-full max-w-md flex-col gap-3 rounded-2xl bg-white p-6 shadow-md">
        <div className="mb-4">
          <h1 className="text-2xl font-semibold">로그인</h1>
          <p className="mt-1 text-sm text-stone-500">
            우리 반 독서 기록을 관리해보세요.
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

        <Button
          className="mt-4 h-12 font-semibold"
          onClick={handleSubmit}
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : (
            "로그인"
          )}
        </Button>

        <div className="text-muted-foreground text-sm">
          계정이 없으시다면?
          <Link
            className="text-muted-foreground ml-2 underline hover:text-sky-600"
            to={"/sign-up"}
          >
            회원가입
          </Link>
        </div>
      </div>
    </div>
  );
}
