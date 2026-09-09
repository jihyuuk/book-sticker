import GlobalError from "@/components/global-error";
import GlobalLoading from "@/components/global-loading";
import PublicNotFound from "@/components/Public-not-fount";
import { usePublicPosts } from "@/hooks/queries/use-public-posts";
import { Link, useNavigate, useParams } from "react-router";
import redBook from "@/assets/book/red-book.webp";
import { formatRelativeTime } from "@/lib/utils";
import { ChartColumn, Pencil, Search } from "lucide-react";

export default function PostListPage() {
  const { publicId } = useParams();
  const navigate = useNavigate();

  const { data, isPending, isError } = usePublicPosts(publicId);

  if (isPending) return <GlobalLoading />;
  if (isError) return <GlobalError />;
  if (!data) return <PublicNotFound />;

  const { classroom, posts } = data;

  return (
    <main className="mx-auto min-h-dvh w-full max-w-2xl bg-white">
      <header className="sticky top-0 z-50 flex h-14 items-center justify-between bg-white px-6 md:h-20">
        <div className="flex items-center gap-2">
          {/* <img src={redBook} alt="북메이트" className="size-8 object-contain" /> */}
          <span className="text-lg font-medium">햇살반 독서장</span>
        </div>
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            <Search className="size-5" strokeWidth={2} />
          </button>

          <button
            type="button"
            onClick={() => navigate(`/classroom/${classroom.public_id}/chart`)}
            className="flex size-10 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            <ChartColumn className="size-5" strokeWidth={2} />
          </button>
        </div>
      </header>

      <div className="mb-8 px-4">
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
          <div className="pb-4">
            {posts.map((post) => (
              <Link
                key={post.id}
                to={`/classroom/${classroom.public_id}/posts/${post.id}`}
                className="block border-b bg-white px-2 py-4 last:border-0"
              >
                {/* 상단: 글 내용 + 이미지 */}
                <div className="flex justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h2 className="truncate text-base font-bold text-gray-900">
                      {post.book.title}
                    </h2>

                    <p className="mt-1 line-clamp-2 text-sm leading-6 text-gray-500">
                      {post.content}
                    </p>
                  </div>

                  <div className="size-20 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                    <img src={redBook} className="h-full w-full object-cover" />
                  </div>
                </div>

                {/* 하단: 작성자 / 시간 / 조회수 */}
                <div className="mt-2 flex items-center justify-between gap-2 text-sm text-gray-400">
                  <div className="flex min-w-0 items-center gap-1">
                    <span className="truncate font-medium text-sky-600">
                      {post.kid.name}
                    </span>
                    <span className="shrink-0">·</span>
                    <span className="shrink-0">
                      {formatRelativeTime(post.created_at)}
                    </span>
                  </div>

                  <div className="shrink-0">조회 12</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* 플로팅 버튼 */}
      <div className="pointer-events-none fixed inset-x-0 bottom-8 z-50">
        <div className="mx-auto flex w-full max-w-2xl justify-end px-8">
          <Link
            to={`/classroom/${classroom.public_id}/posts/new`}
            className="pointer-events-auto flex size-14 items-center justify-center rounded-full bg-sky-400 text-white shadow-lg transition hover:bg-sky-500 active:scale-95"
          >
            {/* <Plus className="size-6" /> */}
            <Pencil className="size-6" />
          </Link>
        </div>
      </div>
    </main>
  );
}
