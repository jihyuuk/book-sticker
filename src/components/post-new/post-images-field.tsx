import { ImagePlus } from "lucide-react";
import { Button } from "../ui/button";
import { Field, FieldLabel } from "../ui/field";

export default function PostImagesField() {
  return (
    <Field className="w-full px-4 py-5">
      <FieldLabel className="text-sm font-semibold">사진</FieldLabel>

      <Button
        type="button"
        variant="outline"
        className="text-muted-foreground h-28 w-full flex-col gap-2 border-dashed"
      >
        <ImagePlus className="size-6" />
        <span>사진 추가</span>
      </Button>
    </Field>
  );
}
