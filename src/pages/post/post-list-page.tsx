import GlobalError from "@/components/global-error";
import GlobalLoading from "@/components/global-loading";
import PublicNotFound from "@/components/Public-not-fount";
import { Button } from "@/components/ui/button";
import { usePublicPosts } from "@/hooks/queries/use-public-posts";
import { Link, useParams } from "react-router";

export default function PostListPage() {
  const { publicId } = useParams();

  const { data, isPending, isError } = usePublicPosts(publicId);

  if (isPending) return <GlobalLoading />;
  if (isError) return <GlobalError />;
  if (!data) return <PublicNotFound />;

  const { classroom, posts } = data;

  return (
    <main className="min-h-dvh bg-gray-50">
      <div className="mx-auto w-full max-w-2xl px-4 py-8">
        {/* 헤더 */}
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {classroom.name}
            </h1>

            <p className="mt-1 text-sm text-gray-500">우리 반 독서 기록</p>
          </div>

          <Button asChild>
            <Link to={`/classroom/${classroom.public_id}/posts/new`}>
              글쓰기
            </Link>
          </Button>
        </header>

        {/* 게시글 없음 */}
        {posts.length === 0 && (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <p className="text-sm text-gray-500">
              아직 작성된 독서 기록이 없습니다.
            </p>
          </div>
        )}

        {/* 게시글 목록 */}
        {posts.length > 0 && (
          <div className="space-y-3">
            {posts.map((post) => (
              <Link
                key={post.id}
                to={`/classroom/${classroom.public_id}/posts/${post.id}`}
                className="block rounded-2xl bg-white p-5 shadow-sm transition hover:bg-gray-50"
              >
                <div className="flex gap-4">
                  {/* 책 표지 */}
                  {post.book.cover_url ? (
                    <img
                      src={post.book.cover_url}
                      alt={post.book.title}
                      className="h-24 w-18 shrink-0 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-24 w-18 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400">
                      표지 없음
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    {/* 책 제목 */}
                    <h2 className="truncate font-bold text-gray-900">
                      {post.book.title}
                    </h2>

                    {/* 아이 / 저자 */}
                    <p className="mt-1 text-sm text-gray-500">
                      {post.kid.name}
                      {post.book.author && ` · ${post.book.author}`}
                    </p>

                    {/* 내용 */}
                    {post.content && (
                      <p className="mt-3 line-clamp-2 text-sm text-gray-600">
                        {post.content}
                      </p>
                    )}

                    {/* 작성일 */}
                    <p className="mt-3 text-xs text-gray-400">
                      {new Date(post.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
