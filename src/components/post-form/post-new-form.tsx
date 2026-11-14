import { useState } from "react";
import PostCaptionField from "../post-field/post-caption-field";
import { toast } from "sonner";
import { useCreatePost } from "@/hooks/mutations/post/use-create-post";
import PostBookField from "../post-field/post-book-field";
import { useNavigate } from "react-router";
import PostKidField from "../post-field/post-kid-field";
import PostPasswordField from "../post-field/post-password-field";
import PostSubmitButton from "../post-field/post-submit-button";
import PostMediaField, {
  type PostMediaData,
} from "../post-field/post-media-field";
import { Loader2 } from "lucide-react";
import { SELECTED_KID_KEY } from "@/lib/constants";
import { FieldGroup } from "../ui/field";
import type { CreatePostParam } from "@/api/post-api";
import { requestScrollReset } from "@/lib/scroll";
import type { PostCreateData } from "@/types/dto/public-dto";
import { useBeforeUnload } from "@/hooks/utils/use-before-unload";
import type { UploadPhase } from "@/lib/media/upload-post-media";
import PostUploadModal, {
  type UploadingFile,
} from "../modal/post-upload-modal";

type Props = {
  data: PostCreateData;
};

type Phase = UploadPhase | "SAVING" | "COMPLETED";

export default function PostNewForm({ data }: Props) {
  const navigate = useNavigate();

  // 새로고침 방지: 기존 정책 유지
  useBeforeUnload(true);

  const { classroom, kids, dailyBookLimit } = data;

  const [kidId, setKidId] = useState(() => {
    const savedKidId = localStorage.getItem(SELECTED_KID_KEY);
    if (savedKidId && kids.some((kid) => kid.id === savedKidId)) {
      return savedKidId;
    }
    return "";
  });
  const [book, setBook] = useState<CreatePostParam["book"] | null>(null);
  const [caption, setCaption] = useState("");
  const [mediaItems, setMediaItems] = useState<PostMediaData[]>([]);
  const [password, setPassword] = useState("");

  const [phase, setPhase] = useState<Phase | null>(null);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [fileProgress, setFileProgress] = useState<Record<string, number>>({});
  const [uploadFailed, setUploadFailed] = useState(false);

  // 콜백은 Edge Function으로 전송되는 게 아니라
  // post-api.ts → upload-post-media.ts에서 이 컴포넌트로 호출됩니다.
  const { mutate, isPending } = useCreatePost({
    onPhaseChange: setPhase,
    onFileProgress: (id, loaded, total) => {
      if (total <= 0) return;
      const percent = Math.min(100, Math.floor((loaded / total) * 100));
      setFileProgress((prev) => ({
        ...prev,
        [id]: percent,
      }));
    },
  });

  const handleKidChange = (id: string) => {
    setKidId(id);
    localStorage.setItem(SELECTED_KID_KEY, id);
  };

  // 영상 메타데이터 확인이 진행 중이거나 실패한 항목은 제출하지 않음
  const isMediaChecking = mediaItems.some(
    (item) => item.type === "new" && item.status !== "ready",
  );

  const [showErrors, setShowErrors] = useState(false);

  const errors = {
    kid: !kidId.trim(),
    book: !book,
    content: !caption.trim(),
    password: password.length < 6,
  };

  const selectedKid = kids.find((kid) => kid.id === kidId);
  const isDailyLimitReached =
    !!selectedKid && selectedKid.todayPostCount >= dailyBookLimit;

  const isFormDisabled = isPending || isDailyLimitReached;

  const handleSubmit = () => {
    if (isFormDisabled || isMediaChecking) return;

    setShowErrors(true);
    const firstError = Object.entries(errors).find(
      ([, hasError]) => hasError,
    )?.[0];

    if (firstError) {
      toast.error("필수 항목을 확인해주세요.");
      requestAnimationFrame(() => {
        document.getElementById(`post-${firstError}`)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
      return;
    }

    if (!book) return;

    // 기존 ID와 배열 순서를 유지해야 업로드 콜백과 sort_order가 일치함
    const media: CreatePostParam["media"] = mediaItems.flatMap((item) =>
      item.type === "new"
        ? [
            {
              id: item.id,
              type: item.mediaType,
              file: item.file,
              durationSeconds: item.durationSeconds,
            },
          ]
        : [],
    );

    const files: UploadingFile[] = [
      ...(book.coverImageFile
        ? [{ id: "book-cover", label: "1. 책 표지" }]
        : []),
      ...media.map((item, index) => ({
        id: item.id,
        label: `${index + (book.coverImageFile ? 2 : 1)}. ${item.type === "VIDEO" ? "동영상" : "사진"}`,
      })),
    ];

    setUploadingFiles(files);
    setFileProgress({});
    setUploadFailed(false);
    setPhase("PREPARING");

    mutate(
      {
        publicId: classroom.publicId,
        book,
        kidId,
        content: caption,
        password,
        media,
      },
      {
        onSuccess: () => {
          requestScrollReset();
          navigate(`/classroom/${classroom.publicId}/posts`, { replace: true });
        },
        onError: (error) => {
          setUploadFailed(true);
          toast.error(
            error instanceof Error
              ? error.message
              : "게시글 등록에 실패했습니다.",
          );
        },
      },
    );
  };

  return (
    <div>
      <FieldGroup className="px-page-x gap-6! py-3 pb-60">
        <PostKidField
          kids={kids}
          value={kidId}
          onValueChange={handleKidChange}
          disabled={isPending}
          error={showErrors && errors.kid}
          limitReached={isDailyLimitReached}
        />

        <PostBookField
          value={book}
          onValueChange={setBook}
          disabled={isFormDisabled}
          error={showErrors && errors.book}
        />

        <PostCaptionField
          value={caption}
          onValueChange={setCaption}
          disabled={isFormDisabled}
          error={showErrors && errors.content}
        />

        <PostMediaField
          value={mediaItems}
          onValueChange={setMediaItems}
          disabled={isFormDisabled}
        />

        <PostPasswordField
          value={password}
          onValueChange={setPassword}
          disabled={isFormDisabled}
          error={showErrors && errors.password}
        />
      </FieldGroup>

      {phase && (
        <PostUploadModal
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

      <PostSubmitButton
        onClick={handleSubmit}
        disabled={isFormDisabled || isMediaChecking}
      >
        {isPending ? <Loader2 className="animate-spin" /> : "작성하기"}
      </PostSubmitButton>
    </div>
  );
}
