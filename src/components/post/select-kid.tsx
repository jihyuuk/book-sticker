import type { PublicKid } from "@/public-types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type Props = {
  kids: PublicKid[];
  value: string;
  onValueChange: (kidId: string) => void;
};

export default function SelectKid({ kids, value, onValueChange }: Props) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm">
      <label className="mb-3 block text-base font-bold text-gray-700">
        어린이
      </label>

      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="!h-14 w-full rounded-xl border-2 border-gray-200 px-4 text-base">
          <SelectValue placeholder="어린이를 선택해주세요" />
        </SelectTrigger>

        <SelectContent>
          {kids.map((kid) => (
            <SelectItem className="h-10" key={kid.id} value={kid.id}>
              {kid.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </section>
  );
}
