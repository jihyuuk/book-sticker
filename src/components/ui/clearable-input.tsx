import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

type ClearableInputProps = Omit<
  React.ComponentProps<typeof Input>,
  "endIcon"
> & {
  onClear: () => void;
};

export default function ClearableInput({
  value,
  onClear,
  ...props
}: ClearableInputProps) {
  const hasValue = String(value ?? "").length > 0;

  return (
    <Input
      {...props}
      value={value}
      endIcon={
        hasValue ? (
          <button
            type="button"
            tabIndex={-1}
            className="pl-1.5"
            aria-label="입력 내용 지우기"
            onClick={onClear}
          >
            <X />
          </button>
        ) : undefined
      }
    />
  );
}
