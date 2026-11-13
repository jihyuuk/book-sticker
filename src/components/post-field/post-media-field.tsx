import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, Dispatch, SetStateAction } from "react";
import { AlertCircle, Film, LoaderCircle, Play, Plus, X } from "lucide-react";
import { toast } from "sonner";

import { Field, FieldLabel } from "@/components/ui/field";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useOpenImageViewer } from "@/store/image-viewer-store";
import { cn } from "cn";

const MAX_MEDIA = 5;
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_VIDEO_BYTES = 500 * 1024 * 1024;
const MAX_VIDEO_SECONDS = 180;

export type PostMediaData =
  | {
      type: "existing";
      id: string; // post_image.id
      previewUrl: string; // 이미지 URL 또는 영상 썸네일 URL
      mediaType?: "IMAGE" | "VIDEO"; // 기존 사진 데이터와도 호환
      videoUrl?: string; // 기존 영상 미리보기용
    }
  | {
      type: "new";
      id: string; // Cloudflare 응답의 clientId와 연결
      file: File;
      previewUrl: string; // 로컬 blob URL
      mediaType: "IMAGE" | "VIDEO";
      status: "checking" | "ready" | "error";
      durationSeconds?: number;
      errorMessage?: string;
    };

type Props = {
  value: PostMediaData[];
  onValueChange: Dispatch<SetStateAction<PostMediaData[]>>;
  disabled?: boolean;
};

function detectMediaType(file: File): "IMAGE" | "VIDEO" | null {
  const name = file.name.toLowerCase();
  if (
    file.type.startsWith("image/") ||
    /\.(jpe?g|png|webp|gif|heic)$/i.test(name)
  )
    return "IMAGE";

  if (
    file.type.startsWith("video/") ||
    /\.(mp4|mov|m4v|webm|3gp|mkv|avi)$/i.test(name)
  )
    return "VIDEO";

  return null;
}

function readVideoDuration(url: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    let settled = false;
    const timeout = window.setTimeout(() => {
      finish(new Error("동영상 길이를 확인하지 못했습니다."));
    }, 15_000);

    function finish(error?: Error, seconds?: number) {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      video.removeAttribute("src");
      video.load();
      if (error) reject(error);
      else resolve(seconds!);
    }

    video.preload = "metadata";
    video.muted = true;
    video.playsInline = true;
    video.onloadedmetadata = () => {
      const seconds = video.duration;
      if (!Number.isFinite(seconds) || seconds <= 0) {
        finish(new Error("동영상 길이를 확인하지 못했습니다."));
      } else {
        finish(undefined, seconds);
      }
    };
    video.onerror = () => {
      finish(new Error("이 브라우저에서 동영상 정보를 읽을 수 없습니다."));
    };
    video.src = url;
  });
}

export default function PostMediaField({
  value,
  onValueChange,
  disabled = false,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const mediaRef = useRef(value);
  const openImageViewer = useOpenImageViewer();
  const [previewVideo, setPreviewVideo] = useState<string | null>(null);

  useEffect(() => {
    mediaRef.current = value;
  }, [value]);

  // 생성한 blob URL은 제거 또는 언마운트 시 해제
  useEffect(() => {
    return () => {
      mediaRef.current.forEach((item) => {
        if (item.type === "new") URL.revokeObjectURL(item.previewUrl);
      });
    };
  }, []);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (!selected.length) return;

    const remaining = MAX_MEDIA - value.length;
    if (remaining <= 0) {
      toast.warning(
        `사진과 동영상은 합쳐서 최대 ${MAX_MEDIA}개까지 가능합니다.`,
      );
      return;
    }
    if (selected.length > remaining) {
      toast.warning(
        `사진과 동영상은 합쳐서 최대 ${MAX_MEDIA}개까지 가능합니다.`,
      );
    }

    const additions: Extract<PostMediaData, { type: "new" }>[] = [];
    for (const file of selected.slice(0, remaining)) {
      const mediaType = detectMediaType(file);
      if (!mediaType) {
        toast.error(`${file.name}: 지원하지 않는 파일 형식입니다.`);
        continue;
      }
      if (file.size <= 0) {
        toast.error(`${file.name}: 비어 있는 파일입니다.`);
        continue;
      }
      const max = mediaType === "IMAGE" ? MAX_IMAGE_BYTES : MAX_VIDEO_BYTES;
      if (file.size > max) {
        toast.error(
          `${file.name}: ${mediaType === "IMAGE" ? "사진 10MB" : "동영상 500MB"}를 초과했습니다.`,
        );
        continue;
      }
      additions.push({
        type: "new",
        id: crypto.randomUUID(),
        file, // 원본 파일: Cloudflare에서 최적화/인코딩
        previewUrl: URL.createObjectURL(file),
        mediaType,
        status: mediaType === "VIDEO" ? "checking" : "ready",
      });
    }

    if (!additions.length) return;
    onValueChange((prev) => [...prev, ...additions]);

    additions.forEach((item) => {
      if (item.mediaType !== "VIDEO") return;
      void readVideoDuration(item.previewUrl)
        .then((duration) => {
          if (duration > MAX_VIDEO_SECONDS) {
            throw new Error("동영상은 최대 3분까지 등록할 수 있습니다.");
          }
          onValueChange((prev) =>
            prev.map((current): PostMediaData =>
              current.type === "new" && current.id === item.id
                ? {
                    ...current,
                    durationSeconds: duration,
                    status: "ready" as const,
                  }
                : current,
            ),
          );
        })
        .catch((error: unknown) => {
          onValueChange((prev) =>
            prev.map((current): PostMediaData =>
              current.type === "new" && current.id === item.id
                ? {
                    ...current,
                    status: "error" as const,
                    errorMessage:
                      error instanceof Error
                        ? error.message
                        : "동영상 검사 실패",
                  }
                : current,
            ),
          );
        });
    });
  };

  const handleRemove = (id: string) => {
    const target = value.find((item) => item.id === id);
    if (target?.type === "new") {
      if (previewVideo === target.previewUrl) setPreviewVideo(null);
      URL.revokeObjectURL(target.previewUrl);
    }
    onValueChange((prev) => prev.filter((item) => item.id !== id));
  };

  const openPreview = (item: PostMediaData) => {
    if (item.mediaType === "VIDEO") {
      const url = item.type === "existing" ? item.videoUrl : item.previewUrl;
      if (url) setPreviewVideo(url);
      else toast.info("동영상 미리보기가 없습니다.");
    } else {
      openImageViewer({ images: [item.previewUrl] });
    }
  };

  return (
    <Field className="w-full">
      <div className="flex items-center justify-between">
        <FieldLabel>사진·동영상</FieldLabel>
        <span className="text-xs text-gray-400">
          {value.length}/{MAX_MEDIA}
        </span>
      </div>

      <div className="flex w-full gap-2 overflow-x-auto pb-4">
        {value.map((item) => {
          const isVideo = item.mediaType === "VIDEO";
          const isChecking = item.type === "new" && item.status === "checking";
          const isError = item.type === "new" && item.status === "error";

          return (
            <div
              key={item.id}
              className={cn(
                "relative size-25 shrink-0 overflow-hidden rounded-lg border bg-gray-100",
                isError && "border-destructive",
              )}
            >
              <button
                type="button"
                className="relative size-full"
                onClick={() => openPreview(item)}
                disabled={isChecking || isError}
                aria-label={isVideo ? "동영상 미리보기" : "사진 미리보기"}
              >
                {isVideo ? (
                  <>
                    {item.type === "new" ? (
                      <video
                        src={item.previewUrl}
                        preload="metadata"
                        muted
                        playsInline
                        className="size-full object-cover"
                      />
                    ) : (
                      <img
                        src={item.previewUrl}
                        alt=""
                        className="size-full object-cover"
                      />
                    )}
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/10">
                      <Play className="size-8 fill-white/80 text-white" />
                    </div>
                    <span className="absolute bottom-1 left-1 flex items-center gap-1 rounded bg-black/60 px-1 text-[10px] text-white">
                      <Film className="size-3" /> 영상
                    </span>
                  </>
                ) : (
                  <>
                    <div className="text-muted-foreground absolute inset-0 flex items-center justify-center text-[10px]">
                      미리보기 불가
                    </div>
                    <img
                      src={item.previewUrl}
                      alt=""
                      className="relative size-full object-cover"
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                    />
                  </>
                )}
              </button>

              {isChecking && (
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/40 text-white">
                  <LoaderCircle className="size-6 animate-spin" />
                  <span className="text-[10px]">영상 확인 중</span>
                </div>
              )}
              {isError && (
                <div className="bg-destructive/20 text-destructive pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1">
                  <AlertCircle className="size-6" />
                  <span className="text-[10px] font-semibold">확인 실패</span>
                </div>
              )}
              {!disabled && (
                <button
                  type="button"
                  onClick={() => handleRemove(item.id)}
                  className="absolute top-1 right-1 z-10 flex size-6 items-center justify-center rounded-full bg-black/40 text-white"
                  aria-label="첨부 삭제"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
          );
        })}

        {value.length < MAX_MEDIA && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={disabled}
            className={cn(
              "text-muted-foreground flex size-25 shrink-0 flex-col items-center justify-center gap-1 rounded-lg border border-dashed bg-gray-100 disabled:opacity-50",
              "hover:border-primary hover:text-primary transition-colors hover:bg-sky-50 active:bg-sky-100",
            )}
          >
            <Plus className="size-6" strokeWidth={1.5} />
            <span className="text-[10px]">추가</span>
          </button>
        )}
      </div>

      {value.some((item) => item.type === "new" && item.status === "error") && (
        <p className="text-destructive text-xs" role="alert">
          동영상 길이를 확인하지 못했거나 제한을 초과한 파일이 있습니다. 해당
          파일을 삭제 후 다시 선택해 주세요.
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*,.heic,.mov,.mp4,.m4v,.webm"
        multiple
        hidden
        disabled={disabled}
        onChange={handleChange}
      />

      <Dialog
        open={previewVideo !== null}
        onOpenChange={(open) => {
          if (!open) setPreviewVideo(null);
        }}
      >
        <DialogContent className="max-w-3xl p-3" aria-describedby={undefined}>
          <DialogTitle className="sr-only">동영상 미리보기</DialogTitle>
          {previewVideo && (
            <video
              src={previewVideo}
              controls
              playsInline
              preload="metadata"
              className="max-h-[75dvh] w-full rounded-lg bg-black"
            />
          )}
        </DialogContent>
      </Dialog>
    </Field>
  );
}
