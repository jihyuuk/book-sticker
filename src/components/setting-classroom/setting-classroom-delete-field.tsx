import { Button } from "../ui/button";
import { Field, FieldLabel } from "../ui/field";

export default function SettingClassroomDeleteField() {
  return (
    <Field>
      <FieldLabel>기타</FieldLabel>

      <Button
        variant="outline"
        className="border-rose-200 bg-rose-50 font-semibold text-rose-600 hover:bg-rose-100 hover:text-rose-700"
      >
        반 삭제하기
      </Button>
    </Field>
  );
}
