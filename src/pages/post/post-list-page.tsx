import PostListFAB from "@/components/post-list/post-list-floating-button";
import PostCard from "@/components/post-card/post-card";
import { usePublicPosts } from "@/hooks/queries/use-public-post";
import { useParams } from "react-router";
import MainHeader from "@/components/header/main-header";
import GlobalError from "@/components/global-error";
import { RotateCw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { INFINITE_SCROLL_ROOT_MARGIN } from "@/lib/constants";
import NotFoundPage from "../not-found-page";
import PublicPostListSkeleton from "@/components/skeletons/public-post-list-skeleton";
import "ldrs/react/LineSpinner.css";
import CustomPullToRefresh from "../../components/pull-to-refresh/custom-pull-to-refresh";
import { useQueryClient, type InfiniteData } from "@tanstack/react-query";
import type { PublicPostsPageData } from "@/types/dto/public-dto";
import { PUBLIC_QUERY_KEYS } from "@/lib/query-keys/public-query-keys";
import TailSpinner from "@/components/pull-to-refresh/tail-spinner";

export default function PostListPage() {
  const { publicId } = useParams();

  const [isPullRefreshing, setIsPullRefreshing] = useState(false);

  const queryClient = useQueryClient();

  const {
    data,
    isPending,
    isError,
    isFetching,
    isRefetching,
    isFetchingNextPage,
    isFetchNextPageError,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = usePublicPosts(publicId);

  //  반 정보
  const classroom = data?.pages[0]?.classroom;

  // 페이지별 게시글을 하나의 배열로 합치기
  const posts = data?.pages.flatMap((page) => page?.posts ?? []) ?? [];

  // 다음 페이지 감지 요소
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // 무한스크롤 감지
  useEffect(() => {
    if (!publicId || !hasNextPage || isFetching || isFetchNextPageError) return;

    const target = loadMoreRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          entry.isIntersecting &&
          queryClient.isFetching({
            queryKey: PUBLIC_QUERY_KEYS.posts.list(publicId),
            exact: true,
          }) === 0
        ) {
          void fetchNextPage();
        }
      },
      {
        rootMargin: INFINITE_SCROLL_ROOT_MARGIN,
      },
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [
    publicId,
    queryClient,
    hasNextPage,
    isFetching,
    isFetchNextPageError,
    fetchNextPage,
  ]);

  // publicId가 없는 경우
  if (!publicId) return <NotFoundPage />;

  const handleRefresh = async () => {
    if (!publicId || isFetching) return;

    setIsPullRefreshing(true);

    try {
      const queryKey = PUBLIC_QUERY_KEYS.posts.list(publicId);

      // 첫 페이지만 유지
      queryClient.setQueryData<
        InfiniteData<PublicPostsPageData, string | null>
      >(queryKey, (old) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.slice(0, 1),
          pageParams: old.pageParams.slice(0, 1),
        };
      });

      await refetch();
    } finally {
      setIsPullRefreshing(false);
    }
  };

  const isInitialError =
    !isPending && ((isError && posts.length === 0) || !classroom);

  const showFAB = !isPending && !isInitialError;

  return (
    <div>
      {/* 헤더 */}
      <MainHeader />

      {isRefetching && !isPullRefreshing && (
        <div className="flex h-16 items-center justify-center pt-5">
          <TailSpinner />
        </div>
      )}

      {/* 본문 */}
      <main className="mx-auto w-full max-w-2xl py-5">
        <CustomPullToRefresh
          onRefresh={handleRefresh}
          isPullable={!isPending && !isFetching}
        >
          {isPending ? (
            // 로딩
            <PublicPostListSkeleton />
          ) : isInitialError ? (
            // 최초 조회 실패
            <GlobalError className="h-80" />
          ) : (
            <>
              {/* 선생님이 작성한 타이틀 */}
              {/* <PostListIntro classroomName={classroom.name} /> */}

              {/* 게시글 목록 */}
              {!posts.length ? (
                <p className="py-16 text-center text-gray-400">
                  아직 작성된 게시글이 없어요.
                </p>
              ) : (
                <>
                  <section className="space-y-15">
                    {posts.map((post) => (
                      <PostCard key={post.id} post={post} />
                    ))}
                  </section>

                  {/* 다음 페이지 감지 요소 */}
                  {hasNextPage && (
                    <div ref={loadMoreRef} className="h-1" aria-hidden="true" />
                  )}

                  {/* 다음 페이지 로딩 */}
                  {isFetchingNextPage && (
                    <div className="flex justify-center py-10">
                      <TailSpinner />
                    </div>
                  )}

                  {/* 다음 페이지 조회 실패 */}
                  {isFetchNextPageError && (
                    <div className="py-10 text-center">
                      <button
                        className="inline-flex items-center gap-2 text-sm text-gray-400"
                        onClick={() => {
                          if (!isFetching && hasNextPage) {
                            void fetchNextPage();
                          }
                        }}
                        disabled={isFetching}
                      >
                        <RotateCw className="size-4" />
                        다시 시도하기
                      </button>
                    </div>
                  )}

                  {/* 마지막 게시글 */}
                  {posts.length > 0 && !hasNextPage && !isFetching && (
                    <div className="pt-10 pb-20 text-center">
                      <p className="text-sm text-gray-400">- 마지막 게시물 -</p>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </CustomPullToRefresh>

        {/* 플로팅 버튼 */}
        {showFAB && <PostListFAB />}
      </main>
    </div>
  );
}
