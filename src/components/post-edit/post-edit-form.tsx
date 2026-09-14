import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

import type { PostEditState } from "@/pages/post/post-edit-page";
import { useUpdatePost } from "@/hooks/mutations/post/use-update-post";

import PostCaptionField from "../post-new/post-caption-field";
import { Field, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

type Props = {
  state: PostEditState;
};

export default function PostEditForm({ state }: Props) {
  const { publicId } = useParams();
  const navigate = useNavigate();

  const { mutate, isPending } = useUpdatePost(publicId);

  const { post, password } = state;
  const { book } = post;

  const originalContent = post.content?.trim() ?? "";

  // 수정 가능
  const [caption, setCaption] = useState(post.content ?? "");

  const trimmedCaption = caption.trim();

  const canSubmit =
    !!trimmedCaption && trimmedCaption !== originalContent && !isPending;

  const handleSubmit = () => {
    if (!publicId) return;

    if (!trimmedCaption) {
      toast.error("독후감을 작성해주세요.");
      return;
    }

    if (trimmedCaption === originalContent) return;

    mutate(
      {
        postId: post.id,
        password,
        content: trimmedCaption,
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
      <section className="px-4 py-5">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold">책 정보</h2>
        </div>

        <div className="flex items-start gap-3 px-4 py-4">
          <div className="aspect-[20/29] w-16 shrink-0 overflow-hidden rounded-md bg-gray-100">
            {book.cover_url && (
              <img
                src={book.cover_url}
                alt={book.title}
                className="h-full w-full object-contain"
              />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="grid grid-cols-[48px_1fr] text-sm">
              <span className="col-span-2 mb-1 truncate text-base font-semibold text-gray-600">
                {book.title}
              </span>

              <span className="text-gray-400">저자</span>
              <span className="truncate text-gray-600">
                {book.author ?? "-"}
              </span>

              <span className="text-gray-400">발행처</span>
              <span className="truncate text-gray-600">
                {book.publisher ?? "-"}
              </span>

              <span className="text-gray-400">ISBN</span>
              <span className="truncate text-gray-600">{book.isbn ?? "-"}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 독후감 */}
      <PostCaptionField
        value={caption}
        onValueChange={setCaption}
        disabled={isPending}
      />

      {/* 수정 버튼 */}
      <section className="px-4 pt-5 pb-2">
        <Button
          type="button"
          className="h-12 w-full bg-sky-500 text-base hover:bg-sky-600"
          onClick={handleSubmit}
          disabled={!canSubmit}
        >
          {isPending ? "수정 중..." : "수정하기"}
        </Button>
      </section>
    </div>
  );
}
