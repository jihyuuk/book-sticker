import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, Dispatch, SetStateAction } from "react";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
  Play,
  Plus,
  X,
} from "lucide-react";

import { Field, FieldLabel } from "@/components/ui/field";
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

  // GIF 업로드 차단
  if (file.type.toLowerCase() === "image/gif" || name.endsWith(".gif")) {
    return null;
  }

  if (file.type.startsWith("image/") || /\.(jpe?g|png|webp|heic)$/i.test(name))
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
  const [selectionError, setSelectionError] = useState<string | null>(null);

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
      setSelectionError(
        `사진과 동영상은 합쳐서 최대 ${MAX_MEDIA}개까지 가능합니다.`,
      );
      return;
    }

    const warnings: string[] = [];
    if (selected.length > remaining) {
      warnings.push(
        `사진과 동영상은 합쳐서 최대 ${MAX_MEDIA}개까지 가능합니다.`,
      );
    }

    const additions: Extract<PostMediaData, { type: "new" }>[] = [];
    for (const file of selected.slice(0, remaining)) {
      const mediaType = detectMediaType(file);
      if (!mediaType) {
        const isGif =
          file.type.toLowerCase() === "image/gif" ||
          file.name.toLowerCase().endsWith(".gif");
        warnings.push(
          isGif
            ? `${file.name}: GIF 이미지는 업로드할 수 없습니다.`
            : `${file.name}: 지원하지 않는 파일 형식입니다.`,
        );
        continue;
      }

      if (file.size <= 0) {
        warnings.push(`${file.name}: 비어 있는 파일입니다.`);
        continue;
      }

      const max = mediaType === "IMAGE" ? MAX_IMAGE_BYTES : MAX_VIDEO_BYTES;
      const isOversized = file.size > max;

      additions.push({
        type: "new",
        id: crypto.randomUUID(),
        file,
        previewUrl: URL.createObjectURL(file),
        mediaType,
        // 크기 초과도 목록에 남겨 사용자가 직접 제거하도록 함
        status: isOversized
          ? "error"
          : mediaType === "VIDEO"
            ? "checking"
            : "ready",
        ...(isOversized && {
          errorMessage:
            mediaType === "IMAGE"
              ? "사진은 10MB 이하만 업로드할 수 있습니다."
              : "동영상은 500MB 이하만 업로드할 수 있습니다.",
        }),
      });
    }

    setSelectionError(warnings[0] ?? null);
    if (!additions.length) return;
    onValueChange((prev) => [...prev, ...additions]);

    additions.forEach((item) => {
      // 이미 용량 초과인 영상은 메타데이터를 읽을 필요가 없음
      if (item.mediaType !== "VIDEO" || item.status !== "checking") return;
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
      URL.revokeObjectURL(target.previewUrl);
    }
    onValueChange((prev) => prev.filter((item) => item.id !== id));
  };

  const moveMedia = (id: string, direction: -1 | 1) => {
    if (disabled) return;
    onValueChange((prev) => {
      const from = prev.findIndex((item) => item.id === id);
      const to = from + direction;
      if (from < 0 || to < 0 || to >= prev.length) return prev;
      const next = [...prev];
      [next[from], next[to]] = [next[to], next[from]];
      return next;
    });
  };

  const openPreview = (item: PostMediaData) => {
    const media = value.map((current) =>
      current.mediaType === "VIDEO"
        ? {
            id: current.id,
            type: "VIDEO" as const,
            url:
              current.type === "existing"
                ? (current.videoUrl ?? "")
                : `${current.previewUrl}#t=0.001`,
            ...(current.type === "existing"
              ? { posterUrl: current.previewUrl }
              : {}),
          }
        : {
            id: current.id,
            type: "IMAGE" as const,
            url: current.previewUrl,
          },
    );

    const initialIndex = value.findIndex((current) => current.id === item.id);
    if (initialIndex < 0) return;
    if (media[initialIndex].type === "VIDEO" && !media[initialIndex].url) {
      setSelectionError("동영상 미리보기를 사용할 수 없습니다.");
      return;
    }

    openImageViewer({ media, initialIndex });
  };

  const hasInvalidMedia = value.some(
    (item) => item.type === "new" && item.status === "error",
  );

  return (
    <Field className="w-full">
      <div className="flex items-center justify-between">
        <FieldLabel>사진 / 동영상</FieldLabel>
        <span className="text-xs text-gray-400">
          {value.length}/{MAX_MEDIA}
        </span>
      </div>

      <div className="flex w-full gap-2 overflow-x-auto pb-4">
        {value.map((item, index) => {
          const isVideo = item.mediaType === "VIDEO";
          const isChecking = item.type === "new" && item.status === "checking";
          const isError = item.type === "new" && item.status === "error";

          return (
            <div
              key={item.id}
              className={cn(
                "relative size-25 shrink-0 overflow-hidden rounded-lg border bg-gray-100",
                isError && "border-destructive border-2",
              )}
            >
              <button
                type="button"
                className="relative size-full"
                onClick={() => openPreview(item)}
                disabled={isChecking || isError}
                aria-label={isVideo ? "동영상 미리보기" : "사진 미리보기"}
                title={isError ? item.errorMessage : undefined}
              >
                {isVideo ? (
                  <>
                    {item.type === "new" ? (
                      <video
                        src={`${item.previewUrl}#t=0.001`}
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
                    {!isError && (
                      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/10">
                        <Play className="size-8 fill-white/80 text-white" />
                      </div>
                    )}
                  </>
                ) : (
                  <img
                    src={item.previewUrl}
                    alt=""
                    className="relative size-full object-cover"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                )}
              </button>

              {isChecking && (
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/40 text-white">
                  <LoaderCircle className="size-6 animate-spin" />
                  <span className="text-[10px]">영상 확인 중</span>
                </div>
              )}
              {isError && (
                <div className="bg-destructive/10 pointer-events-none absolute inset-0 flex items-center justify-center">
                  <AlertCircle className="text-destructive size-7" />
                </div>
              )}
              {!disabled && value.length > 1 && (
                <div className="absolute right-1 bottom-1 z-10 flex rounded-md bg-black/60 text-white">
                  <button
                    type="button"
                    className="flex size-6 items-center justify-center disabled:opacity-30"
                    onClick={() => moveMedia(item.id, -1)}
                    disabled={index === 0}
                    aria-label="첨부를 왼쪽으로 이동"
                  >
                    <ChevronLeft className="size-4" />
                  </button>
                  <button
                    type="button"
                    className="flex size-6 items-center justify-center disabled:opacity-30"
                    onClick={() => moveMedia(item.id, 1)}
                    disabled={index === value.length - 1}
                    aria-label="첨부를 오른쪽으로 이동"
                  >
                    <ChevronRight className="size-4" />
                  </button>
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

      {hasInvalidMedia && (
        <p className="text-destructive text-xs" role="alert">
          사진(10MB 이하) / 동영상(3분, 500MB 이하)만 업로드 가능합니다.
        </p>
      )}

      {selectionError && (
        <p className="text-destructive text-xs" role="alert">
          {selectionError}
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic,image/heif,video/*,.heic,.heif,.mov,.mp4,.m4v,.webm"
        multiple
        hidden
        disabled={disabled}
        onChange={handleChange}
      />
    </Field>
  );
}
