import { Input } from "@/components/ui/input";

type Props = Omit<
  React.ComponentProps<typeof Input>,
  "type" | "inputMode" | "value" | "onChange"
> & {
  value: string;
  onValueChange: (value: string) => void;
  removeLeadingZeros?: boolean;
};

export default function NumberInput({
  value,
  onValueChange,
  removeLeadingZeros = false,
  ...props
}: Props) {
  return (
    <Input
      {...props}
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      value={value}
      onChange={(e) => {
        let nextValue = e.target.value.replace(/\D/g, "");

        if (removeLeadingZeros) {
          nextValue = nextValue.replace(/^0+(?=\d)/, "");
        }

        onValueChange(nextValue);
      }}
    />
  );
}
