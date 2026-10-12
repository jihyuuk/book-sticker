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
    <Field className="w-full">
      <FieldLabel>작성자</FieldLabel>

      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger>
          <SelectValue placeholder="작성자를 선택해주세요" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {kids.map((kid) => (
              <SelectItem key={kid.id} value={kid.id}>
                {kid.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  );
}
