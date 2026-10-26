import { Field, FieldError, FieldLabel } from "../ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import type { PostCreateData } from "@/types/dto/public-dto";

type Props = {
  kids: PostCreateData["kids"];
  value: string;
  onValueChange: (kidId: string) => void;
  disabled?: boolean;
  error: boolean;
  limitReached: boolean;
};

export default function PostKidField({
  kids,
  value,
  onValueChange,
  disabled,
  error,
  limitReached,
}: Props) {
  const errorMessage = limitReached
    ? "오늘은 더 이상 작성할 수 없어요."
    : error
      ? "작성자를 선택해주세요."
      : null;

  return (
    <Field className="w-full">
      <FieldLabel id="post-kid" className="scroll-mt-24">
        작성자
      </FieldLabel>

      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger aria-invalid={error || limitReached}>
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

      {errorMessage && <FieldError>{errorMessage}</FieldError>}
    </Field>
  );
}
