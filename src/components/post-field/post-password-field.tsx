import { Field, FieldDescription, FieldLabel } from "../ui/field";
import PasswordInput from "../ui/password-input";

type Props = {
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
};

export default function PostPasswordField({
  value,
  onValueChange,
  disabled,
}: Props) {
  return (
    <Field className="-mt-4 w-full gap-1">
      <FieldLabel>비밀번호</FieldLabel>

      <FieldDescription className="mb-1.5 text-xs text-gray-400">
        게시글을 수정하거나 삭제할 때 사용됩니다.
      </FieldDescription>

      <PasswordInput
        placeholder="비밀번호 입력"
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        disabled={disabled}
      />
    </Field>
  );
}
