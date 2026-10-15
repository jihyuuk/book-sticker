import { Skeleton } from "../ui/skeleton";

export default function AdminPostListSkeleton() {
  return (
    <section
      className="h-[calc(100dvh-152px)] overflow-hidden bg-white md:h-[calc(100dvh-160px)]"
      aria-hidden="true"
    >
      <div className="space-y-15">
        {Array.from({ length: 2 }).map((_, index) => (
          <article key={index}>
            {/* 헤더 */}
            <div className="px-page-x flex items-center">
              <div className="flex items-center gap-3">
                {/* 프로필 */}
                <Skeleton className="size-10 shrink-0 rounded-full" />

                {/* 이름 / 작성 시간 */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            </div>

            {/* 독서록 */}
            <div className="px-page-x py-3">
              <div className="space-y-2 px-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            </div>

            {/* 게시글 이미지 */}
            <div className="px-page-x mb-2">
              <Skeleton className="aspect-square w-full rounded-sm" />
            </div>

            {/* 책 정보 */}
            <div className="px-page-x">
              <div className="border-muted flex gap-3 border-l-2 bg-zinc-50 p-2">
                {/* 책 표지 */}
                <Skeleton className="aspect-20/29 h-18 shrink-0 rounded-md" />

                {/* 도서 정보 */}
                <div className="min-w-0 flex-1 space-y-2 py-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-3 w-2/3" />
                  <Skeleton className="h-3 w-3/5" />
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
