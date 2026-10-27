import PostListFAB from "@/components/post-list/post-list-floating-button";
import PostListIntro from "@/components/post-list/post-list-intro";
import PostCard from "@/components/post-card/post-card";
import { usePublicPosts } from "@/hooks/queries/use-public-post";
import { useParams } from "react-router";
import MainHeader from "@/components/header/main-header";
import GlobalError from "@/components/global-error";
import { LoaderCircle, RotateCw } from "lucide-react";
import { useEffect, useRef } from "react";
import { INFINITE_SCROLL_ROOT_MARGIN } from "@/lib/constants";
import NotFoundPage from "../not-found-page";
import PublicPostListSkeleton from "@/components/skeletons/public-post-list-skeleton";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function PostListPage() {
  //자동포커스
  const inputRef = useRef<HTMLInputElement>(null);

  const { publicId } = useParams();

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
  } = usePublicPosts(publicId);

  //  반 정보
  const classroom = data?.pages[0]?.classroom;

  // 페이지별 게시글을 하나의 배열로 합치기
  const posts = data?.pages.flatMap((page) => page?.posts ?? []) ?? [];

  // 다음 페이지 감지 요소
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // 무한스크롤 감지
  useEffect(() => {
    if (!hasNextPage || isFetching || isFetchNextPageError) return;

    const target = loadMoreRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void fetchNextPage();
        }
      },
      {
        rootMargin: INFINITE_SCROLL_ROOT_MARGIN,
      },
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [hasNextPage, isFetching, isFetchNextPageError, fetchNextPage]);

  // publicId가 없는 경우
  if (!publicId) return <NotFoundPage />;

  return (
    <div>
      {/* 헤더 */}
      <MainHeader />

      {/* 본문 */}
      <main className="mx-auto w-full max-w-2xl py-5">
        {isPending ? (
          // 로딩
          <PublicPostListSkeleton />
        ) : (isError && posts.length === 0) || !classroom ? (
          // 최초 조회 실패
          <GlobalError className="h-80" />
        ) : (
          <>
            {/* 선생님이 작성한 타이틀 */}
            <PostListIntro classroomName={classroom.name} />

            <Drawer repositionInputs={true}>
              <DrawerTrigger asChild>
                <Button>비밀번호 입력</Button>
              </DrawerTrigger>

              <DrawerContent
                onOpenAutoFocus={(event) => {
                  event.preventDefault();
                  inputRef.current?.focus();
                }}
              >
                <DrawerHeader>
                  <DrawerTitle>비밀번호 확인</DrawerTitle>
                </DrawerHeader>

                <div className="flex gap-2 p-4">
                  <Input
                    ref={inputRef}
                    type="password"
                    placeholder="비밀번호"
                    onBlur={(e) => {
                      e.currentTarget.focus();
                    }}
                  />
                  <DrawerClose asChild>
                    <Button onPointerDown={(e) => e.preventDefault()}>
                      닫기
                    </Button>
                  </DrawerClose>
                </div>
              </DrawerContent>
            </Drawer>

            {isRefetching && (
              <div className="flex justify-center py-3">
                <LoaderCircle className="size-5 animate-spin text-gray-400" />
              </div>
            )}

            {/* 게시글 목록 */}
            {!posts.length ? (
              <p className="py-16 text-center text-gray-400">
                아직 작성된 게시글이 없어요.
              </p>
            ) : (
              <>
                <section className="space-y-20">
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
                    <LoaderCircle className="size-6 animate-spin text-gray-400" />
                  </div>
                )}

                {/* 다음 페이지 조회 실패 */}
                {isFetchNextPageError && (
                  <div className="py-10 text-center">
                    <button
                      className="inline-flex items-center gap-2 text-sm text-gray-500"
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
                  <div className="pt-3 pb-20 text-center">
                    <p className="text-sm text-gray-400">- 마지막 게시물 -</p>
                  </div>
                )}
              </>
            )}

            {/* 플로팅 버튼 */}
            <PostListFAB />
          </>
        )}
      </main>
    </div>
  );
}
