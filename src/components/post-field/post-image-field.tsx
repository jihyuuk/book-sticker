import { useEffect, useRef } from "react";
import { ImagePlus, X } from "lucide-react";
import { toast } from "sonner";

import { Field, FieldLabel } from "@/components/ui/field";

export type PostImageData =
  | {
      type: "existing";
      id: string; // post_image.id
      previewUrl: string; // signed URL
    }
  | {
      type: "new";
      id: string; // 프론트 임시 id
      file: File;
      previewUrl: string; // blob URL
    };

type Props = {
  value: PostImageData[];
  onValueChange: (images: PostImageData[]) => void;
  disabled?: boolean;
};

const MAX_IMAGES = 5;

export default function PostImageField({
  value,
  onValueChange,
  disabled,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const imagesRef = useRef(value);

  // 언마운트 시 현재 남아있는 preview URL 정리용
  useEffect(() => {
    imagesRef.current = value;
  }, [value]);

  useEffect(() => {
    return () => {
      imagesRef.current.forEach((image) => {
        if (image.type === "new") {
          URL.revokeObjectURL(image.previewUrl);
        }
      });
    };
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);

    if (files.length === 0) {
      return;
    }

    const remainingCount = MAX_IMAGES - value.length;

    if (remainingCount <= 0) {
      toast.warning("사진은 최대 5장까지 등록할 수 있어요.");
      event.target.value = "";
      return;
    }

    if (files.length > remainingCount) {
      toast.warning(`사진은 최대 ${MAX_IMAGES}장까지 등록할 수 있어요.`);
    }

    const selectedFiles = files.slice(0, remainingCount);

    const newImages: PostImageData[] = selectedFiles.map((file) => ({
      type: "new",
      id: crypto.randomUUID(),
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    onValueChange([...value, ...newImages]);

    // 같은 사진을 다시 선택할 수 있도록 초기화
    event.target.value = "";
  };

  const handleRemove = (id: string) => {
    const target = value.find((image) => image.id === id);

    if (target?.type === "new") {
      URL.revokeObjectURL(target.previewUrl);
    }

    onValueChange(value.filter((image) => image.id !== id));
  };

  return (
    <Field className="w-full px-4 py-5">
      <div className="flex items-center justify-between">
        <FieldLabel className="text-sm font-semibold">사진</FieldLabel>

        <span className="text-xs text-gray-400">
          {value.length}/{MAX_IMAGES}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {value.map((image) => (
          <div
            key={image.id}
            className="relative size-20 overflow-hidden rounded-lg bg-gray-100"
          >
            <img
              src={image.previewUrl}
              alt=""
              className="size-full object-cover"
            />

            {!disabled && (
              <button
                type="button"
                onClick={() => handleRemove(image.id)}
                className="absolute top-1 right-1 flex size-6 items-center justify-center rounded-full bg-black/60 text-white"
                aria-label="사진 삭제"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
        ))}

        {value.length < MAX_IMAGES && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={disabled}
            className="flex size-20 flex-col items-center justify-center gap-1 rounded-lg border border-dashed text-gray-400 disabled:opacity-50"
          >
            <ImagePlus className="size-5" />
            <span className="text-xs">사진 추가</span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={handleChange}
      />
    </Field>
  );
}
