import type { PublicKid } from "@/types/public-types";
import { Field, FieldError, FieldLabel } from "../ui/field";
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
  error: boolean;
};

export default function PostKidField({
  kids,
  value,
  onValueChange,
  disabled,
  error,
}: Props) {
  return (
    <Field className="w-full">
      <FieldLabel id="post-kid" className="scroll-mt-24">
        작성자
      </FieldLabel>

      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger aria-invalid={error}>
          <SelectValue placeholder="누가 읽었나요?" />
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

      {error && <FieldError>작성자를 선택해주세요.</FieldError>}
    </Field>
  );
}
