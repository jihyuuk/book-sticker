import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { BookOpen } from "lucide-react";
import { toast } from "sonner";

import type { PublicPost } from "@/public-types";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import PostCaptionField from "@/components/post-new/post-caption-field";

type PostEditState = {
  post: PublicPost;
  password: string;
};

export default function PostEditPage() {
  const { publicId, postId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as PostEditState | null;

  const post = state?.post;
  const password = state?.password;

  const [caption, setCaption] = useState(post?.content ?? "");

  const isValidState = !!post && !!password && post.id === postId;

  useEffect(() => {
    if (isValidState) return;

    toast.error("수정 정보를 확인할 수 없습니다. 다시 시도해주세요.");

    if (publicId) {
      navigate(`/classroom/${publicId}/posts`, {
        replace: true,
      });
    }
  }, [isValidState, publicId, navigate]);

  if (!isValidState || !post || !password) {
    return null;
  }

  const isChanged = caption.trim() !== (post.content?.trim() ?? "");

  const handleSubmit = () => {
    // 나중에 update mutation 연결
    console.log({
      postId: post.id,
      password,
      content: caption.trim(),
    });
  };

  return (
    <main className="min-h-dvh bg-white">
      <div className="mx-auto w-full max-w-2xl pb-10">
        <header className="flex h-14 items-center px-4">
          <h1 className="text-lg font-semibold">게시글 수정</h1>
        </header>

        <div className="mt-2 space-y-2">
          {/* 작성자 */}
          <Field className="w-full px-4 py-5">
            <FieldLabel className="text-sm font-semibold">작성자</FieldLabel>

            <div className="flex h-12 items-center rounded-md border bg-gray-50 px-4">
              <span className="text-sm text-gray-700">{post.kid.name}</span>
            </div>
          </Field>

          {/* 책 */}
          <Field className="w-full px-4 py-5">
            <FieldLabel className="text-sm font-semibold">읽은 책</FieldLabel>

            <div className="flex min-h-24 items-center gap-4 rounded-lg border bg-gray-50 p-3">
              {post.book.cover_url ? (
                <img
                  src={post.book.cover_url}
                  alt=""
                  className="aspect-2/3 h-16 shrink-0 rounded object-cover"
                />
              ) : (
                <div className="flex aspect-2/3 h-16 shrink-0 items-center justify-center rounded bg-gray-100">
                  <BookOpen className="size-5 text-gray-400" />
                </div>
              )}

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">
                  {post.book.title}
                </p>

                {post.book.author && (
                  <p className="text-muted-foreground mt-1 truncate text-sm">
                    {post.book.author}
                  </p>
                )}

                {post.book.publisher && (
                  <p className="text-muted-foreground mt-0.5 truncate text-xs">
                    {post.book.publisher}
                  </p>
                )}
              </div>
            </div>
          </Field>

          {/* 독후감 */}
          <PostCaptionField value={caption} onValueChange={setCaption} />

          {/* 수정 버튼 */}
          <div className="px-4 pt-5">
            <Button
              type="button"
              disabled={!isChanged}
              onClick={handleSubmit}
              className="h-12 w-full bg-sky-500 text-base hover:bg-sky-600"
            >
              수정하기
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
