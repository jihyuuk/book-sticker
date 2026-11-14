import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { FunctionsHttpError } from "@supabase/supabase-js";
import { Loader2 } from "lucide-react";

import { useUpdatePost } from "@/hooks/mutations/post/use-update-post";
import { useClearPostEditSession } from "@/store/post-edit-session-store";
import { useBeforeUnload } from "@/hooks/utils/use-before-unload";
import { isPostEditable } from "@/lib/post-edit-date-limit";
import type { PublicPost } from "@/types/dto/public-dto";
import type { UploadPhase } from "@/lib/media/upload-post-media";

import PostCaptionField from "../post-field/post-caption-field";
import PostSubmitButton from "../post-field/post-submit-button";
import PostMediaField, {
  type PostMediaData,
} from "../post-field/post-media-field";
import PostBookField from "../post-field/post-book-field";
import PostEditPasswordDrawer from "../drawers/post-edit-password-drawer";
import PostUploadModal, {
  type UploadingFile,
} from "../modal/post-upload-modal";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";

type PostMediaItem =
  | { id: string; type: "IMAGE"; url: string }
  | { id: string; type: "VIDEO"; url: string; posterUrl: string };

type Props = {
  // 조회 V2가 내려주는 media. 이전 photos-only 데이터도 마이그레이션 과정에서 표시합니다.
  post: PublicPost;
  password: string | null;
};

type Phase = UploadPhase | "SAVING" | "COMPLETED";

function getInitialMedia(post: Props["post"]): PostMediaData[] {
  const postMedia = (post as PublicPost & { media?: PostMediaItem[] }).media;
  const items: PostMediaItem[] =
    postMedia ??
    post.images.map((image) => ({
      id: image.id,
      type: "IMAGE" as const,
      url: image.imageUrl,
    }));

  return items.map((item) =>
    item.type === "IMAGE"
      ? {
          type: "existing" as const,
          id: item.id,
          mediaType: "IMAGE" as const,
          previewUrl: item.url,
        }
      : {
          type: "existing" as const,
          id: item.id,
          mediaType: "VIDEO" as const,
          previewUrl: item.posterUrl,
          videoUrl: item.url,
        },
  );
}

export default function PostEditForm({ post, password }: Props) {
  const { publicId } = useParams();
  const navigate = useNavigate();
  const clearEditSession = useClearPostEditSession();

  useBeforeUnload(true);

  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [passwordResetKey, setPasswordResetKey] = useState(0);
  const [showErrors, setShowErrors] = useState(false);

  const [caption, setCaption] = useState(post.content ?? "");
  const [mediaItems, setMediaItems] = useState<PostMediaData[]>(() =>
    getInitialMedia(post),
  );

  const [phase, setPhase] = useState<Phase | null>(null);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [fileProgress, setFileProgress] = useState<Record<string, number>>({});
  const [uploadFailed, setUploadFailed] = useState(false);

  const { mutate, isPending } = useUpdatePost(publicId, {
    onPhaseChange: setPhase,
    onFileProgress: (id, loaded, total) => {
      if (total <= 0) return;
      setFileProgress((prev) => ({
        ...prev,
        [id]: Math.min(100, Math.floor((loaded / total) * 100)),
      }));
    },
  });

  const originalContent = post.content?.trim() ?? "";
  const originalIds = getInitialMedia(post).map((item) => item.id);
  const trimmedCaption = caption.trim();

  const existingIds = mediaItems
    .filter((item) => item.type === "existing")
    .map((item) => item.id);

  const mediaChanged =
    mediaItems.some((item) => item.type === "new") ||
    existingIds.length !== originalIds.length ||
    existingIds.some((id, index) => id !== originalIds[index]);
  const isDirty = trimmedCaption !== originalContent || mediaChanged;

  const isMediaChecking = mediaItems.some(
    (item) => item.type === "new" && item.status !== "ready",
  );
  const canSubmit =
    !!trimmedCaption && isDirty && !isPending && !isMediaChecking;

  const submitUpdate = (verifiedPassword: string) => {
    if (!publicId || !canSubmit) return;
    if (!isPostEditable(post.createdAt)) {
      setIsPasswordOpen(false);
      toast.error("게시글은 작성 당일에만 수정할 수 있습니다.");
      return;
    }

    const files: UploadingFile[] = mediaItems
      .filter((item) => item.type === "new")
      .map((item, index) => ({
        id: item.id,
        label: `${index + 1}. ${item.mediaType === "VIDEO" ? "동영상" : "사진"}`,
      }));

    setUploadingFiles(files);
    setFileProgress({});
    setUploadFailed(false);
    setPhase(files.length > 0 ? "PREPARING" : "SAVING");
    setIsPasswordOpen(false);

    mutate(
      {
        postId: post.id,
        password: verifiedPassword,
        content: trimmedCaption,
        media: mediaItems,
      },
      {
        onSuccess: () => {
          toast.success("게시물이 수정되었습니다.");
          navigate(`/classroom/${publicId}/posts`, { replace: true });
        },
        onError: (error) => {
          if (
            error instanceof FunctionsHttpError &&
            error.context.status === 401
          ) {
            // 비밀번호 실패는 업로드 실패가 아닙니다.
            setUploadFailed(false);
            setPhase(null);
            clearEditSession();
            setPasswordResetKey((prev) => prev + 1);
            setIsPasswordOpen(true);
            toast.error("비밀번호가 올바르지 않습니다.");
            return;
          }

          setUploadFailed(true);
          if (
            error instanceof FunctionsHttpError &&
            error.context.status === 503
          ) {
            toast.error(
              "수정 상태를 확인할 수 없습니다. 목록을 다시 조회해주세요.",
            );
            return;
          }
          toast.error(
            error instanceof Error
              ? error.message
              : "게시물 수정에 실패했습니다.",
          );
        },
      },
    );
  };

  const handleSubmit = () => {
    if (!publicId || isPending || isMediaChecking) return;
    if (!isPostEditable(post.createdAt)) {
      toast.error("게시글은 작성 당일에만 수정할 수 있습니다.");
      return;
    }
    setShowErrors(true);
    if (!trimmedCaption) {
      toast.error("독후감을 작성해주세요.");
      return;
    }
    if (!isDirty) return;
    if (!password) {
      setIsPasswordOpen(true);
      return;
    }
    submitUpdate(password);
  };

  return (
    <div>
      <FieldGroup className="px-page-x gap-6! py-3 pb-60">
        <Field className="w-full">
          <FieldLabel className="text-sm font-semibold">
            작성자{" "}
            <span className="text-muted-foreground text-xs font-normal">
              (수정 불가)
            </span>
          </FieldLabel>
          <Input className="h-12 px-4 text-sm" value={post.kid.name} readOnly />
        </Field>

        <PostBookField
          value={{ ...post.book, coverImageFile: null }}
          onValueChange={() => {}}
          disabled
          isUpdate
        />

        <PostCaptionField
          value={caption}
          onValueChange={setCaption}
          disabled={isPending}
          error={showErrors && !trimmedCaption}
        />

        <PostMediaField
          value={mediaItems}
          onValueChange={setMediaItems}
          disabled={isPending}
        />
      </FieldGroup>

      {phase && (
        <PostUploadModal
          mode="UPDATE"
          open={isPending || uploadFailed}
          phase={phase}
          files={uploadingFiles}
          progress={fileProgress}
          failed={uploadFailed}
          onDismissError={() => {
            setPhase(null);
          }}
        />
      )}

      <PostSubmitButton onClick={handleSubmit} disabled={!canSubmit}>
        {isPending ? <Loader2 className="animate-spin" /> : "수정하기"}
      </PostSubmitButton>

      <PostEditPasswordDrawer
        open={isPasswordOpen}
        onOpenChange={setIsPasswordOpen}
        isPending={isPending}
        resetKey={passwordResetKey}
        onSubmit={submitUpdate}
      />
    </div>
  );
}
