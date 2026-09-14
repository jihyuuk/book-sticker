import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type Props = {
  label: string;
  value: string;
  placeholder: string;
  onValueChange: (value: string) => void;
};

export default function PostBookInputField({
  label,
  value,
  placeholder,
  onValueChange,
}: Props) {
  return (
    <Field className="w-full px-4 py-2">
      <FieldLabel className="text-sm font-semibold">{label}</FieldLabel>

      <Input
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        className="h-12 px-4 text-sm"
        placeholder={placeholder}
      />
    </Field>
  );
}
