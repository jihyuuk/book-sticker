import { useState } from "react";
import PostCaptionField from "../post-field/post-caption-field";
import { toast } from "sonner";
import { useCreatePost } from "@/hooks/mutations/post/use-create-post";
import PostBookField from "../post-field/post-book-field";
import { useNavigate } from "react-router";
import PostKidField from "../post-field/post-kid-field";
import PostPasswordField from "../post-field/post-password-field";
import PostSubmitButton from "../post-field/post-submit-button";
import { Loader2 } from "lucide-react";
import { SELECTED_KID_KEY } from "@/lib/constants";
import { FieldGroup } from "../ui/field";
import type { CreatePostParam } from "@/api/post-api";
import { requestScrollReset } from "@/lib/scroll";
import type { PostCreateData } from "@/types/dto/public-dto";
import { useBeforeUnload } from "@/hooks/utils/use-before-unload";
import type { UploadPhase } from "@/lib/media/upload-post-media";
import type { PostMediaData } from "../post-field/post-media-field";
import PostMediaField from "../post-field/post-media-field";

type Props = {
  data: PostCreateData;
};

type Phase = UploadPhase | "SAVING" | "COMPLETED";

type UploadingFile = {
  id: string;
  name: string;
  size: number;
};

const phaseLabels: Record<Phase, string> = {
  PREPARING: "업로드 준비 중...",
  COVER: "책 표지 업로드 중...",
  MEDIA: "사진·동영상 업로드 중...",
  SAVING: "게시글 저장 중...",
  COMPLETED: "게시글 등록 완료",
};

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

  // 파일 크기 가중 전체 진행률. 100% 전송과 DB 저장 완료는 별개.
  const totalBytes = uploadingFiles.reduce((sum, file) => sum + file.size, 0);
  const sentBytes = uploadingFiles.reduce(
    (sum, file) => sum + file.size * ((fileProgress[file.id] ?? 0) / 100),
    0,
  );
  const overallProgress =
    phase === "SAVING" || phase === "COMPLETED"
      ? 100
      : totalBytes > 0
        ? Math.min(100, Math.floor((sentBytes / totalBytes) * 100))
        : 0;

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
        ? [
            {
              id: "book-cover",
              name: "책 표지",
              size: book.coverImageFile.size,
            },
          ]
        : []),
      ...media.map((item, index) => ({
        id: item.id,
        name: `${item.type === "VIDEO" ? "영상" : "사진"} ${index + 1}`,
        size: item.file.size,
      })),
    ];

    setUploadingFiles(files);
    setFileProgress({});
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
          setPhase(null);
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

      {/* 기존 전역 로딩 오버레이 대신 업로드 진행률 표시 */}
      {isPending && phase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div
            className="bg-background w-full max-w-md space-y-4 rounded-2xl border p-5 shadow-xl"
            role="status"
          >
            <div className="flex items-center justify-between gap-2 text-sm">
              <span className="font-semibold" aria-live="polite">
                {phaseLabels[phase]}
              </span>
              <span className="text-muted-foreground tabular-nums">
                {overallProgress}%
              </span>
            </div>

            <div className="space-y-2 text-sm">
              {(
                [
                  ["PREPARING", "업로드 준비"],
                  ...(book?.coverImageFile
                    ? [["COVER", "책 표지 업로드"]]
                    : []),
                  ...(uploadingFiles.some((file) => file.id !== "book-cover")
                    ? [["MEDIA", "사진·동영상 업로드"]]
                    : []),
                  ["SAVING", "게시글 저장"],
                ] as [Exclude<Phase, "COMPLETED">, string][]
              ).map(([step, label], index, stages) => {
                const activeIndex =
                  phase === "COMPLETED"
                    ? stages.length
                    : stages.findIndex(([key]) => key === phase);
                const done = index < activeIndex;
                return (
                  <div key={step} className="flex items-center gap-2">
                    <div
                      className={`flex size-6 shrink-0 items-center justify-center rounded-full text-xs ${
                        done
                          ? "bg-primary text-primary-foreground"
                          : index === activeIndex
                            ? "bg-muted text-foreground"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {done ? "✓" : index + 1}
                    </div>
                    <span
                      className={
                        index > activeIndex ? "text-muted-foreground" : ""
                      }
                    >
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="space-y-2">
              <div className="bg-muted h-2 overflow-hidden rounded-full">
                <div
                  className="bg-primary h-full rounded-full transition-[width]"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
              {uploadingFiles.length > 0 && phase !== "SAVING" && (
                <div className="text-muted-foreground max-h-32 space-y-1 overflow-y-auto text-xs">
                  {uploadingFiles.map((file) => (
                    <div key={file.id} className="flex justify-between gap-2">
                      <span className="truncate">{file.name}</span>
                      <span className="tabular-nums">
                        {fileProgress[file.id] ?? 0}%
                      </span>
                    </div>
                  ))}
                </div>
              )}
              {phase === "SAVING" && (
                <p className="text-muted-foreground text-xs">
                  파일 전송이 끝났습니다. DB 저장 완료를 확인하는 중입니다.
                </p>
              )}
            </div>
          </div>
        </div>
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
