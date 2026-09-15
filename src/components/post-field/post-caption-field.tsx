import { Field, FieldLabel } from "../ui/field";
import { Textarea } from "../ui/textarea";

type Props = {
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
};

export default function PostCaptionField({
  value,
  onValueChange,
  disabled,
}: Props) {
  return (
    <Field className="w-full px-4 py-5">
      <FieldLabel className="text-sm font-semibold">독후감</FieldLabel>

      <Textarea
        placeholder="아이와 함께한 독서 이야기를 남겨주세요."
        className="min-h-32 resize-none p-4 text-sm"
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        disabled={disabled}
      />
    </Field>
  );
}
