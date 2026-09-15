import type { PublicKid } from "@/types/public-types";
import { Field, FieldLabel } from "../ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type Props = {
  kids: PublicKid[];
  value: string;
  onValueChange: (kidId: string) => void;
  disabled?: boolean;
};

export default function PostKidField({
  kids,
  value,
  onValueChange,
  disabled,
}: Props) {
  return (
    <Field className="w-full px-4 py-5">
      <FieldLabel className="text-sm font-semibold">작성자</FieldLabel>

      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger className="!h-12 px-4 text-sm">
          <SelectValue placeholder="작성자를 선택해주세요" />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectGroup>
            {kids.map((kid) => (
              <SelectItem
                className="h-12 px-4 text-sm"
                key={kid.id}
                value={kid.id}
              >
                {kid.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  );
}
