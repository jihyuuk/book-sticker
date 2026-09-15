import { Field, FieldDescription, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";

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
    <Field className="w-full px-4 py-5">
      <FieldLabel className="text-sm font-semibold">비밀번호</FieldLabel>

      <Input
        type="password"
        placeholder="비밀번호"
        className="h-12 px-4 text-sm"
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        disabled={disabled}
      />

      <FieldDescription className="pl-1 text-xs text-gray-400">
        게시글을 수정하거나 삭제할 때 사용됩니다.
      </FieldDescription>
    </Field>
  );
}
