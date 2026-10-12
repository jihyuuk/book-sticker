import { useEffect, useRef } from "react";
import { AlertCircle, LoaderCircle, Plus, X } from "lucide-react";
import { toast } from "sonner";

import { Field, FieldLabel } from "@/components/ui/field";
import { cn } from "cn";
import { optimizeImage } from "@/lib/image-optimzie";

type ImageStatus = "optimizing" | "ready" | "error";

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
      status: ImageStatus; // 최적화 상태
    };

type Props = {
  value: PostImageData[];
  onValueChange: React.Dispatch<React.SetStateAction<PostImageData[]>>;
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

    if (files.length === 0) return;

    const remainingCount = MAX_IMAGES - value.length;

    if (remainingCount <= 0) {
      toast.warning(`사진은 최대 ${MAX_IMAGES}장까지 등록할 수 있어요.`);
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
      status: "optimizing",
    }));

    // 1. 원본 이미지 즉시 표시
    onValueChange((prev) => [...prev, ...newImages]);

    event.target.value = "";

    // 2. 이미지별 비동기 최적화
    newImages.forEach(async (image) => {
      if (image.type !== "new") return;

      try {
        const optimizedFile = await optimizeImage(image.file);

        // 3. 최적화 성공
        onValueChange((prev) =>
          prev.map((item) =>
            item.id === image.id && item.type === "new"
              ? {
                  ...item,
                  file: optimizedFile,
                  status: "ready",
                }
              : item,
          ),
        );
      } catch (error) {
        console.error("이미지 최적화 실패:", error);

        // 4. 최적화 실패
        onValueChange((prev) =>
          prev.map((item) =>
            item.id === image.id && item.type === "new"
              ? {
                  ...item,
                  status: "error",
                }
              : item,
          ),
        );
      }
    });
  };

  const handleRemove = (id: string) => {
    const target = value.find((image) => image.id === id);

    if (target?.type === "new") {
      URL.revokeObjectURL(target.previewUrl);
    }

    onValueChange(value.filter((image) => image.id !== id));
  };

  return (
    <Field className="w-full">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <FieldLabel>사진 / 동영상</FieldLabel>

        <span className="text-xs text-gray-400">
          {value.length}/{MAX_IMAGES}
        </span>
      </div>

      {/* 이미지 영역 */}
      <div className="flex w-full gap-2 overflow-x-auto pb-4">
        {value.map((image) => (
          <div
            key={image.id}
            className={cn(
              "relative size-25 shrink-0 overflow-hidden rounded-lg border bg-white",
              image.type === "new" &&
                image.status === "error" &&
                "border-destructive",
            )}
          >
            {/* 이미지 미리보기 */}
            <img
              src={image.previewUrl}
              alt=""
              className="size-full object-cover"
            />

            {/* 최적화 중 */}
            {image.type === "new" && image.status === "optimizing" && (
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center bg-black/30 text-white">
                <LoaderCircle className="size-6 animate-spin" />
              </div>
            )}

            {/* 최적화 실패 */}
            {image.type === "new" && image.status === "error" && (
              <div className="text-destructive bg-destructive/20 pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1">
                <AlertCircle className="size-6" />
                <span className="text-xs font-semibold">업로드 실패</span>
              </div>
            )}

            {/* 삭제 버튼 */}
            {!disabled && (
              <button
                type="button"
                onClick={() => handleRemove(image.id)}
                className="absolute top-1 right-1 z-10 flex size-6 items-center justify-center rounded-full bg-black/30 text-white"
                aria-label="사진 삭제"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
        ))}

        {/* 이미지 추가 버튼 */}
        {value.length < MAX_IMAGES && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={disabled}
            className={cn(
              "text-muted-foreground flex size-25 shrink-0 flex-col items-center justify-center gap-1 rounded-lg border border-dashed bg-gray-100 disabled:opacity-50",
              "hover:border-primary hover:text-primary transition-colors hover:bg-sky-50",
              "active:bg-sky-100",
            )}
          >
            <Plus className="size-6" strokeWidth={1.5} />
          </button>
        )}
      </div>

      {/* 가려진 인풋 */}
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
