import { Field, FieldDescription, FieldError, FieldLabel } from "../ui/field";
import PasswordInput from "../ui/password-input";

type Props = {
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  error: boolean;
};

export default function PostPasswordField({
  value,
  onValueChange,
  disabled,
  error,
}: Props) {
  const MIN_PWD_LENGTH = 6;
  const isShort = value.length > 0 && value.length < MIN_PWD_LENGTH;
  const isLong = value.length >= MIN_PWD_LENGTH;

  return (
    <Field id="post-password" className="w-full scroll-mt-24 gap-1">
      <FieldLabel>비밀번호</FieldLabel>

      <FieldDescription className="-mt-1! mb-1.5 text-xs text-gray-400">
        게시글을 수정하거나 삭제할 때 사용됩니다.
      </FieldDescription>

      <PasswordInput
        placeholder="6자 이상 비밀번호"
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        disabled={disabled}
        aria-invalid={error || isShort}
      />

      {(error || isShort) && <FieldError>6자 이상 입력해 주세요.</FieldError>}

      {isLong && (
        <FieldError className="text-green-600!">
          적합한 비밀번호입니다.
        </FieldError>
      )}
    </Field>
  );
}
