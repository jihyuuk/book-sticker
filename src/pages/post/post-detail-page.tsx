import GlobalError from "@/components/global-error";
import GlobalLoading from "@/components/global-loading";
import PublicNotFound from "@/components/Public-not-fount";
import { Button } from "@/components/ui/button";
import { usePublicPostDetail } from "@/hooks/queries/use-public-post-detail";
import { ArrowLeftIcon, PencilIcon } from "lucide-react";
import { Link, useParams } from "react-router";

export default function PostDetailPage() {
  const { publicId, postId } = useParams();

  const { data, isPending, isError } = usePublicPostDetail(publicId, postId);

  if (isPending) return <GlobalLoading />;
  if (isError) return <GlobalError />;
  if (!data) return <PublicNotFound />;

  const { classroom, post } = data;

  if (!post) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500">게시글을 찾을 수 없습니다.</p>

          <Button asChild variant="outline" className="mt-4">
            <Link to={`/classroom/${classroom.public_id}/posts`}>
              목록으로 돌아가기
            </Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-dvh bg-gray-50">
      <div className="mx-auto w-full max-w-2xl px-4 py-8 md:py-12">
        {/* 상단 */}
        <header className="mb-5 flex items-center justify-between">
          <Button variant="ghost" size="sm" asChild>
            <Link to={`/classroom/${classroom.public_id}/posts`}>
              <ArrowLeftIcon />
              목록
            </Link>
          </Button>

          <Button variant="outline" size="sm" asChild>
            <Link
              to={`/classroom/${classroom.public_id}/posts/${post.id}/edit`}
            >
              <PencilIcon />
              수정
            </Link>
          </Button>
        </header>

        <article className="overflow-hidden rounded-2xl bg-white shadow-sm">
          {/* 책 정보 */}
          <section className="flex gap-5 border-b border-gray-100 p-5 md:p-6">
            {post.book.cover_url ? (
              <img
                src={post.book.cover_url}
                alt={post.book.title}
                className="h-36 w-24 shrink-0 rounded-xl object-cover"
              />
            ) : (
              <div className="flex h-36 w-24 shrink-0 items-center justify-center rounded-xl bg-gray-100 px-2 text-center text-xs text-gray-400">
                표지 없음
              </div>
            )}

            <div className="min-w-0 flex-1">
              <p className="mb-2 text-sm font-semibold text-sky-500">
                {post.kid.name}의 독서 기록
              </p>

              <h1 className="text-xl font-bold text-gray-900 md:text-2xl">
                {post.book.title}
              </h1>

              {post.book.author && (
                <p className="mt-2 text-sm text-gray-500">{post.book.author}</p>
              )}

              {post.book.publisher && (
                <p className="mt-1 text-sm text-gray-400">
                  {post.book.publisher}
                </p>
              )}

              {post.book.isbn && (
                <p className="mt-3 text-xs text-gray-400">
                  ISBN {post.book.isbn}
                </p>
              )}
            </div>
          </section>

          {/* 독서 기록 */}
          <section className="p-5 md:p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-bold text-gray-800">독서 기록</h2>

              <time className="text-xs text-gray-400">
                {new Date(post.created_at).toLocaleDateString()}
              </time>
            </div>

            <p className="leading-7 break-words whitespace-pre-wrap text-gray-700">
              {post.content}
            </p>
          </section>
        </article>
      </div>
    </main>
  );
}
