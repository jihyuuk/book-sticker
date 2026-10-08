import SubHeader from "@/components/header/sub-header";
import { Button } from "@/components/ui/button";
import ClearableInput from "@/components/ui/clearable-input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import PasswordInput from "@/components/ui/password-input";
import { useSignUp } from "@/hooks/mutations/auth/use-sign-up";
import { EMAIL_REGEX, VERIFICATION_EMAIL } from "@/lib/constants";
import { generateErrorMessage } from "@/lib/supabse-error";
import { Loader2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

type FieldName = "kindergartenName" | "email" | "password" | "passwordConfirm";
type FormErrors = Partial<Record<FieldName, string>>;

export default function SignUpPage() {
  const navigate = useNavigate();

  const { mutate: signUp, isPending } = useSignUp();

  const [kindergartenName, setKindergartenName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [errors, setErrors] = useState<FormErrors>({});

  const passwordValid = password.length >= 6;

  const passwordConfirmValid =
    passwordConfirm.length > 0 && password === passwordConfirm;

  // 필드 수정 시 해당 에러 제거
  const clearError = (field: FieldName) => {
    setErrors((prev) => ({
      ...prev,
      [field]: undefined,
    }));
  };

  // 유효성 검사
  const validate = (): boolean => {
    const nextErrors: FormErrors = {};

    // 유치원 이름
    if (!kindergartenName.trim()) {
      nextErrors.kindergartenName = "유치원 이름을 입력해 주세요.";
    }

    // 이메일
    if (!email.trim()) {
      nextErrors.email = "이메일을 입력해 주세요.";
    } else if (!EMAIL_REGEX.test(email.trim())) {
      nextErrors.email = "올바른 이메일 주소를 입력해 주세요.";
    }

    // 비밀번호
    if (!password) {
      nextErrors.password = "비밀번호를 입력해 주세요.";
    } else if (password.length < 6) {
      nextErrors.password = "비밀번호는 6자 이상 입력해 주세요.";
    }

    // 비밀번호 확인
    if (!passwordConfirm) {
      nextErrors.passwordConfirm = "비밀번호를 다시 입력해 주세요.";
    } else if (password !== passwordConfirm) {
      nextErrors.passwordConfirm = "비밀번호가 일치하지 않습니다.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  // 회원가입
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setKindergartenName(kindergartenName.trim());
    setEmail(email.trim());

    if (!validate()) return;

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
          toast.error(generateErrorMessage(error));
        },
      },
    );
  };

  return (
    <div>
      <SubHeader title="회원가입" />

      <main className="px-page-x mx-auto w-full max-w-2xl py-5">
        <form onSubmit={handleSubmit} noValidate>
          <FieldGroup>
            {/* 유치원 이름 */}
            <Field>
              <FieldLabel htmlFor="kindergartenName">유치원 이름</FieldLabel>

              <ClearableInput
                id="kindergartenName"
                value={kindergartenName}
                onChange={(e) => {
                  setKindergartenName(e.target.value);
                  clearError("kindergartenName");
                }}
                onClear={() => {
                  setKindergartenName("");
                  clearError("kindergartenName");
                }}
                placeholder="유치원 이름 입력"
                disabled={isPending}
                aria-invalid={!!errors.kindergartenName}
                aria-describedby={
                  errors.kindergartenName ? "kindergartenName-error" : undefined
                }
              />

              {errors.kindergartenName && (
                <FieldError id="kindergartenName-error">
                  {errors.kindergartenName}
                </FieldError>
              )}
            </Field>

            {/* 이메일 */}
            <Field>
              <FieldLabel htmlFor="email">이메일</FieldLabel>

              <ClearableInput
                id="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  clearError("email");
                }}
                onClear={() => {
                  setEmail("");
                  clearError("email");
                }}
                placeholder="이메일 주소 입력"
                disabled={isPending}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
              />

              {errors.email && (
                <FieldError id="email-error">{errors.email}</FieldError>
              )}
            </Field>

            {/* 비밀번호 */}
            <FieldGroup className="gap-2!">
              <Field>
                <FieldLabel htmlFor="password">비밀번호</FieldLabel>

                <PasswordInput
                  id="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    clearError("password");
                    clearError("passwordConfirm");
                  }}
                  placeholder="6자 이상 비밀번호 입력"
                  disabled={isPending}
                  aria-invalid={!!errors.password}
                  aria-describedby={
                    errors.password ? "password-error" : undefined
                  }
                />

                {password ? (
                  <p
                    className={`text-caption-1 ${passwordValid ? "text-green-600" : "text-destructive"}`}
                  >
                    {passwordValid
                      ? "적합한 비밀번호입니다."
                      : "6자 이상 입력해 주세요."}
                  </p>
                ) : (
                  errors.password && <FieldError>{errors.password}</FieldError>
                )}
              </Field>

              <Field>
                {/* 비밀번호 확인 */}
                <PasswordInput
                  id="passwordConfirm"
                  autoComplete="new-password"
                  value={passwordConfirm}
                  onChange={(e) => {
                    setPasswordConfirm(e.target.value);
                    clearError("passwordConfirm");
                  }}
                  placeholder="비밀번호 확인"
                  disabled={isPending}
                  aria-invalid={!!errors.passwordConfirm}
                  aria-describedby={
                    errors.passwordConfirm ? "passwordConfirm-error" : undefined
                  }
                />

                {passwordConfirm ? (
                  <p
                    className={`text-caption-1 ${passwordConfirmValid ? "text-green-600" : "text-destructive"}`}
                  >
                    {passwordConfirmValid
                      ? "비밀번호가 일치합니다."
                      : "비밀번호가 일치하지 않습니다."}
                  </p>
                ) : (
                  errors.passwordConfirm && (
                    <FieldError>{errors.passwordConfirm}</FieldError>
                  )
                )}
              </Field>
            </FieldGroup>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? <Loader2 className="animate-spin" /> : "회원가입"}
            </Button>
          </FieldGroup>
        </form>
      </main>
    </div>
  );
}
