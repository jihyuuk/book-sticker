import { Button } from "../ui/button";
import { Field, FieldLabel } from "../ui/field";

export default function SettingClassroomDeleteField() {
  return (
    <Field className="w-full px-4 pt-2">
      <FieldLabel className="text-sm font-semibold text-rose-600">
        반 삭제
      </FieldLabel>

      <Button
        type="button"
        variant="outline"
        className="h-12 w-full border-rose-200 bg-rose-50 font-semibold text-rose-600 hover:bg-rose-100 hover:text-rose-700"
      >
        반 삭제하기
      </Button>
    </Field>
  );
}
