import { useState } from "react";
import PostCaptionField from "../post-new/post-caption-field";
import type { PostEditState } from "@/pages/post/post-edit-page";
import { Field, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import type { PublicBook } from "@/public-types";
import { toast } from "sonner";

type Props = {
  state: PostEditState;
};

export default function PostEditForm({ state }: Props) {
  const isPending = false;

  const { post, password } = state;
  const { book } = post;

  //수정 가능
  const [caption, setCaption] = useState(state.post.content ?? "");

  const handleSubmit = () => {
    const message = validatePostForm({
      kidId: post.kid.id,
      book,
      caption,
      password,
    });

    if (message) {
      toast.error(message);
      return;
    }

    // validatePostForm에서 이미 검사했지만
    // TypeScript 타입 좁히기용
    if (!book) return;

    //수정 x
    if (post.content === caption.trim()) return;
  };
  const can = caption.trim() && post.content !== caption.trim();

  return (
    <div className="mt-2 space-y-2">
      {/* 작성자 */}
      <Field className="w-full px-4 py-5">
        <FieldLabel className="text-sm font-semibold">작성자</FieldLabel>

        <Input
          className="h-12 px-4 text-sm"
          value={post.kid.name}
          disabled={true}
        />
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
                src={book.cover_url ?? ""}
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

      {/* 작성 버튼 */}
      <section className="px-4 pt-5 pb-2">
        <Button
          className="h-12 w-full bg-sky-500 text-base hover:bg-sky-600"
          onClick={handleSubmit}
          disabled={!can}
        >
          수정하기
        </Button>
      </section>
    </div>
  );
}

//검증
function validatePostForm({
  kidId,
  book,
  caption,
  password,
}: {
  kidId: string;
  book: PublicBook | null;
  caption: string;
  password: string;
}) {
  if (!kidId) return "작성자를 선택해주세요.";
  if (!book) return "책을 선택해주세요.";
  if (!caption.trim()) return "독후감을 작성해주세요.";
  if (!password.trim()) return "비밀번호를 입력해주세요.";
  if (password.length < 4) return "비밀번호는 4자리 이상 입력해주세요.";

  return null;
}
