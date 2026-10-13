import { Input } from "@/components/ui/input";

type Props = Omit<
  React.ComponentProps<typeof Input>,
  "type" | "inputMode" | "value" | "onChange"
> & {
  value: string;
  onValueChange: (value: string) => void;
};

export default function NumberInput({ value, onValueChange, ...props }: Props) {
  return (
    <Input
      {...props}
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      value={value}
      onChange={(e) => {
        const nextValue = e.target.value.replace(/\D/g, "");
        onValueChange(nextValue);
      }}
    />
  );
}
