import { cn } from "cn";
import { Field, FieldLabel } from "../ui/field";
import { Textarea } from "../ui/textarea";

type Props = {
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
};

const MAX_LENGTH = 300;

export default function PostCaptionField({
  value,
  onValueChange,
  disabled,
}: Props) {
  return (
    <Field className="w-full">
      <FieldLabel>독후감</FieldLabel>

      <div
        className={cn(
          "overflow-hidden rounded-[6px]",
          "border border-transparent bg-gray-100",
          "focus-within:border-primary focus-within:bg-blue-50",
        )}
      >
        <Textarea
          placeholder="책을 읽고 어떤 생각이 들었나요?"
          className={cn(
            "field-sizing-content max-h-52 min-h-32 resize-none overflow-y-auto",
            "text-body-2! rounded-none border-0 bg-transparent px-4 pt-4 pb-2 shadow-none",
            "focus-visible:border-0 focus-visible:bg-transparent focus-visible:ring-0",
          )}
          maxLength={MAX_LENGTH}
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          disabled={disabled}
        />

        <div className="px-4 pb-3 text-right text-xs text-gray-400">
          {value.length}/{MAX_LENGTH} 자
        </div>
      </div>
    </Field>
  );
}
