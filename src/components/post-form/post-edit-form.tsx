import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

import { useUpdatePost } from "@/hooks/mutations/post/use-update-post";

import PostCaptionField from "../post-field/post-caption-field";
import { Field, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import PostBookField from "../post-field/post-book-field";
import type { PublicPost } from "@/types/public-types";
import PostSubmitButton from "../post-field/post-submit-button";
import type { PostImageData } from "../post-field/post-image-field";
import PostImageField from "../post-field/post-image-field";

type Props = {
  post: PublicPost;
  password: string;
};

export default function PostEditForm({ post, password }: Props) {
  const { publicId } = useParams();
  const navigate = useNavigate();

  const { mutate, isPending } = useUpdatePost(publicId);

  const { book } = post;

  const originalContent = post.content?.trim() ?? "";
  const originalImageIds = post.images.map((image) => image.id);

  // 수정 가능
  const [caption, setCaption] = useState(post.content ?? "");
  const [images, setImages] = useState<PostImageData[]>(
    post.images.map((image) => ({
      type: "existing",
      id: image.id,
      previewUrl: image.imageUrl,
    })),
  );

  const trimmedCaption = caption.trim();

  const currentExistingIds = images
    .filter((image) => image.type === "existing")
    .map((image) => image.id);

  const imageChanged =
    images.some((image) => image.type === "new") ||
    currentExistingIds.length !== originalImageIds.length ||
    currentExistingIds.some((id, index) => id !== originalImageIds[index]);

  const contentChanged = trimmedCaption !== originalContent;

  const canSubmit =
    !!trimmedCaption && (contentChanged || imageChanged) && !isPending;

  const handleSubmit = () => {
    if (!publicId) return;

    if (!trimmedCaption) {
      toast.error("독후감을 작성해주세요.");
      return;
    }

    mutate(
      {
        postId: post.id,
        password,
        content: trimmedCaption,
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

  return (
    <div className="mt-2 space-y-2">
      {/* 작성자 */}
      <Field className="w-full px-4 py-5">
        <FieldLabel className="text-sm font-semibold">작성자</FieldLabel>

        <Input className="h-12 px-4 text-sm" value={post.kid.name} disabled />
      </Field>

      {/* 책 */}
      <PostBookField value={book} onValueChange={() => {}} disabled={true} />

      {/* 독후감 */}
      <PostCaptionField
        value={caption}
        onValueChange={setCaption}
        disabled={isPending}
      />

      {/* 사진 */}
      <PostImageField
        value={images}
        onValueChange={setImages}
        disabled={isPending}
      />

      {/* 수정 버튼 */}
      <PostSubmitButton onClick={handleSubmit} disabled={!canSubmit}>
        {isPending ? "수정 중..." : "수정하기"}
      </PostSubmitButton>
    </div>
  );
}
