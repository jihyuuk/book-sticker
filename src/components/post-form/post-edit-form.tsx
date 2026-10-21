import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

import { useUpdatePost } from "@/hooks/mutations/post/use-update-post";

import PostCaptionField from "../post-field/post-caption-field";
import type { PublicPost } from "@/types/public-types";
import PostSubmitButton from "../post-field/post-submit-button";
import type { PostImageData } from "../post-field/post-image-field";
import PostImageField from "../post-field/post-image-field";
import { Loader2 } from "lucide-react";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import PostBookField from "../post-field/post-book-field";

type Props = {
  post: PublicPost;
  password: string;
};

export default function PostEditForm({ post, password }: Props) {
  const { publicId } = useParams();
  const navigate = useNavigate();

  // 게시글 수정 API
  const { mutate, isPending } = useUpdatePost(publicId);

  // ==================================================
  // 1. 원본 데이터 (변경 여부 비교용)
  // ==================================================

  // 기존 독후감 내용
  const originalContent = post.content?.trim() ?? "";

  // 기존 게시글 이미지 ID 목록 (순서 유지)
  const originalImageIds = post.images.map((image) => image.id);

  // ==================================================
  // 2. 수정 가능한 데이터
  // ==================================================

  // 독후감
  const [caption, setCaption] = useState(post.content ?? "");

  // 이미지
  // 기존 이미지는 type: "existing"으로 관리
  // 새로 추가한 이미지는 PostImageField에서 type: "new"로 관리
  const [images, setImages] = useState<PostImageData[]>(
    post.images.map((image) => ({
      type: "existing",
      id: image.id,
      previewUrl: image.imageUrl,
    })),
  );

  // 빈칸 오류 표시 여부
  const [showErrors, setShowErrors] = useState(false);

  // ==================================================
  // 3. 변경 여부 확인
  // ==================================================

  // 독후감 앞뒤 공백 제거
  const trimmedCaption = caption.trim();

  // 현재 남아 있는 기존 이미지 ID 목록
  const currentExistingIds = images
    .filter((image) => image.type === "existing")
    .map((image) => image.id);

  // 이미지 변경 여부
  // 1. 새로운 이미지가 추가됐거나
  // 2. 기존 이미지 개수가 달라졌거나
  // 3. 기존 이미지 순서가 달라졌다면 변경된 것으로 판단
  const imageChanged =
    images.some((image) => image.type === "new") ||
    currentExistingIds.length !== originalImageIds.length ||
    currentExistingIds.some((id, index) => id !== originalImageIds[index]);

  // 독후감 변경 여부
  const contentChanged = trimmedCaption !== originalContent;

  // ==================================================
  // 4. 이미지 최적화 상태
  // ==================================================

  // 새 이미지 중 최적화 중이거나 실패한 이미지가 있는지
  // 모든 새 이미지가 ready 상태여야 서버 전송 가능
  const isImageProcessing = images.some(
    (image) => image.type === "new" && image.status !== "ready",
  );

  // ==================================================
  // 5. 유효성 검사 및 수정 버튼 활성화
  // ==================================================

  const errors = {
    content: !trimmedCaption,
  };

  // 수정 가능 조건
  // 1. 독후감이 비어 있지 않아야 함
  // 2. 독후감 또는 이미지가 변경되어야 함
  // 3. 서버 요청 중이 아니어야 함
  // 4. 이미지 최적화가 모두 완료되어야 함
  const canSubmit =
    !!trimmedCaption &&
    (contentChanged || imageChanged) &&
    !isPending &&
    !isImageProcessing;

  // ==================================================
  // 6. 게시글 수정 요청
  // ==================================================

  const handleSubmit = () => {
    // 필수 경로값이 없거나 처리 중이라면 중단
    if (!publicId || isPending || isImageProcessing) return;

    // 빈칸 오류 표시 활성화
    setShowErrors(true);

    // 독후감 필수 입력 확인
    if (!trimmedCaption) {
      toast.error("독후감을 작성해주세요.");
      return;
    }

    // 게시글 수정 API 요청
    mutate(
      {
        postId: post.id,
        password,
        content: trimmedCaption,

        // 기존 이미지 + 새 이미지를 함께 전달
        // 실제 추가/유지/삭제는 수정 API에서 처리
        images,
      },
      {
        onSuccess: () => {
          toast.success("게시물이 수정되었습니다.");
          navigate(-1);
        },

        onError: () => {
          toast.error("게시물 수정에 실패했습니다.");
        },
      },
    );
  };

  // ==================================================
  // 7. UI
  // ==================================================

  return (
    <div>
      <FieldGroup className="px-page-x gap-6! py-3 pb-60">
        {/* 작성자 - 수정 불가 */}
        <Field className="w-full">
          <FieldLabel className="text-sm font-semibold">
            작성자{" "}
            <span className="text-muted-foreground text-xs font-normal">
              수정불가
            </span>
          </FieldLabel>

          <Input className="h-12 px-4 text-sm" value={post.kid.name} readOnly />
        </Field>

        {/* 책 - 수정 불가 */}
        <PostBookField
          value={{
            ...post.book,
            coverImageFile: null,
          }}
          onValueChange={() => {}}
          disabled
          isUpdate
        />

        {/* 독후감 - 수정 가능 */}
        <PostCaptionField
          value={caption}
          onValueChange={setCaption}
          disabled={isPending}
          error={showErrors && errors.content}
        />

        {/* 사진 - 추가 및 삭제 가능 */}
        <PostImageField
          value={images}
          onValueChange={setImages}
          disabled={isPending}
        />
      </FieldGroup>

      {/* 수정 버튼 */}
      <PostSubmitButton onClick={handleSubmit} disabled={!canSubmit}>
        {isPending ? <Loader2 className="animate-spin" /> : "수정하기"}
      </PostSubmitButton>
    </div>
  );
}
