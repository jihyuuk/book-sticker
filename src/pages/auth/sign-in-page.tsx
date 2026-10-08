import { Button } from "@/components/ui/button";
import { useSignIn } from "@/hooks/mutations/auth/use-sign-in";
import { generateErrorMessage } from "@/lib/supabse-error";
import { Loader2, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import logo from "@/assets/logo.png";
import PasswordInput from "@/components/ui/password-input";
import ClearableInput from "@/components/ui/clearable-input";
import { EMAIL_REGEX } from "@/lib/constants";

type LoginErrors = {
  email?: string;
  password?: string;
};

export default function SignInPage() {
  const { mutate: signIn, isPending } = useSignIn();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<LoginErrors | null>(null);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setLoginError((prev) => (prev ? { ...prev, email: undefined } : null));
  };

  const handleClear = () => {
    setEmail("");
    setLoginError((prev) => (prev ? { ...prev, email: undefined } : null));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setLoginError((prev) => (prev ? { ...prev, password: undefined } : null));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoginError(null);

    const isEmailEmpty = !email.trim();
    const isPasswordEmpty = !password;

    const nextErrors: LoginErrors = {};

    //이메일 검증
    if (isEmailEmpty) {
      nextErrors.email = "이메일 주소를 입력해 주세요";
    } else if (!EMAIL_REGEX.test(email.trim())) {
      nextErrors.email = "올바른 이메일 형식을 입력해 주세요";
    }

    //비밀번호 검증
    if (isPasswordEmpty) {
      nextErrors.password = "비밀번호를 입력해 주세요";
    }

    if (nextErrors.email || nextErrors.password) {
      setLoginError(nextErrors);
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
    <main className="px-page-x mx-auto mt-5 w-full max-w-md py-5">
      <form onSubmit={handleSubmit} className="w-full space-y-5">
        {/* 로고 */}
        <div className="flex items-center justify-center p-4">
          <img
            src={logo}
            width={714}
            height={256}
            className="w-full max-w-50"
          />
        </div>

        {/* 아이디, 비번 인풋 */}
        <div className="space-y-3 px-0.5">
          <div>
            <ClearableInput
              variant="underline"
              size="xl"
              value={email}
              onChange={handleEmailChange}
              onClear={handleClear}
              placeholder="이메일 주소"
              startIcon={<Mail className="text-sky-600" />}
              disabled={isPending}
              aria-invalid={!!loginError?.email}
            />
            {loginError?.email && (
              <p className="text-caption-1 text-destructive mt-2">
                {loginError.email}
              </p>
            )}
          </div>

          <div>
            <PasswordInput
              variant="underline"
              size="xl"
              placeholder="비밀번호"
              value={password}
              startIcon={<Lock className="text-sky-600" />}
              onChange={handlePasswordChange}
              disabled={isPending}
              aria-invalid={!!loginError?.password}
            />
            {loginError?.password && (
              <p className="text-caption-1 text-destructive mt-2">
                {loginError.password}
              </p>
            )}
          </div>
        </div>

        {/* 로그인 버튼 */}
        <Button
          type="submit"
          size="xl"
          className="mt-5 w-full"
          disabled={isPending}
        >
          {isPending ? <Loader2 className="animate-spin" /> : "로그인"}
        </Button>

        {/* 회원가입 링크 */}
        <div className="text-body-2 text-center">
          <span className="text-muted-foreground">계정이 없으신가요?</span>
          <Link className="ml-2 text-sky-600 underline" to={"/sign-up"}>
            회원가입
          </Link>
        </div>
      </form>
    </main>
  );
}
