import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronDown, RotateCw, SearchX } from "lucide-react";
import { TailChase } from "ldrs/react";
import "ldrs/react/TailChase.css";

import SearchHeader from "@/components/header/search-header";
import PostCard from "@/components/post-card/post-card";
import GlobalError from "@/components/global-error";
import TailSpinner from "@/components/pull-to-refresh/tail-spinner";

import { usePublicSearchPosts } from "@/hooks/queries/use-public-search-posts";
import type { PublicSearchSort } from "@/api/public-search-api";
import { PUBLIC_QUERY_KEYS } from "@/lib/query-keys/public-query-keys";
import { INFINITE_SCROLL_ROOT_MARGIN } from "@/lib/constants";
import PublicNotFound from "@/components/Public-not-found";

const DEBOUNCE_MS = 500;

export default function SearchPostPage() {
  const { publicId } = useParams();
  const queryClient = useQueryClient();

  const [searchValue, setSearchValue] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [sortOrder, setSortOrder] = useState<PublicSearchSort>("latest");

  const loadMoreRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number | null>(null);

  const keyword = searchValue.trim();
  const hasKeyword = keyword.length > 0;

  // ======================================================
  // 1. 검색어 디바운스
  // ======================================================

  useEffect(() => {
    if (!keyword) {
      setDebouncedKeyword("");
      return;
    }

    const timer = window.setTimeout(() => {
      setDebouncedKeyword(keyword);
    }, DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [keyword]);

  // ======================================================
  // 2. 검색 API 조회
  // ======================================================

  const {
    data,
    isPending,
    isError,
    isFetching,
    isFetchingNextPage,
    isFetchNextPageError,
    isPlaceholderData,
    hasNextPage,
    fetchNextPage,
  } = usePublicSearchPosts(publicId, debouncedKeyword, sortOrder);

  const totalCount = data?.pages[0]?.totalCount ?? 0;

  // 페이지별 게시글 합치기
  const posts = useMemo(
    () =>
      hasKeyword ? (data?.pages.flatMap((page) => page.posts ?? []) ?? []) : [],
    [data?.pages, hasKeyword],
  );

  // 검색 요청 중 (다음 페이지 조회는 제외)
  const isSearchLoading =
    hasKeyword &&
    !!debouncedKeyword &&
    (isPending || (isFetching && !isFetchingNextPage));

  // 검색 요청 실패
  const isInitialError =
    hasKeyword && !isSearchLoading && isError && posts.length === 0;

  // 검색 결과 없음
  const isEmpty =
    hasKeyword &&
    keyword === debouncedKeyword &&
    !isPending &&
    !isSearchLoading &&
    !isError &&
    posts.length === 0;

  // ======================================================
  // 3. 무한스크롤
  // ======================================================

  useEffect(() => {
    if (
      !publicId ||
      !debouncedKeyword ||
      keyword !== debouncedKeyword ||
      !hasNextPage ||
      isFetching ||
      isPlaceholderData ||
      isFetchNextPageError
    ) {
      return;
    }

    const target = loadMoreRef.current;
    if (!target) return;

    const queryKey = PUBLIC_QUERY_KEYS.posts.search(
      publicId,
      debouncedKeyword,
      sortOrder,
    );

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          entry.isIntersecting &&
          queryClient.isFetching({
            queryKey,
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
    debouncedKeyword,
    keyword,
    sortOrder,
    queryClient,
    hasNextPage,
    isFetching,
    isPlaceholderData,
    isFetchNextPageError,
    fetchNextPage,
  ]);

  // ======================================================
  // 4. 스크롤 시 키보드 포커스 해제
  // ======================================================

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;

    const diff = Math.abs(e.touches[0].clientY - touchStartY.current);

    if (diff > 10) {
      if (document.activeElement instanceof HTMLInputElement) {
        document.activeElement.blur();
      }

      touchStartY.current = null;
    }
  };

  const handleTouchEnd = () => {
    touchStartY.current = null;
  };

  // ======================================================
  // 5. 검색어 변경
  // ======================================================

  const handleChangeValue = (value: string) => {
    setSearchValue(value);

    if (!value.trim()) {
      setDebouncedKeyword("");
    }
  };

  // URL publicId 검증
  if (!publicId) return <PublicNotFound />;

  return (
    <div className="flex min-h-dvh flex-col">
      {/* 헤더 */}
      <SearchHeader value={searchValue} onChangeValue={handleChangeValue} />

      {/* 본문 */}
      <main
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        className="relative mx-auto w-full max-w-2xl flex-1"
      >
        {/* 검색 결과 건수 및 정렬 */}
        {hasKeyword && posts.length > 0 && (
          <div className="flex items-center justify-between px-4 pb-6">
            <div className="flex items-center text-sm">
              <span className="mr-1 font-medium text-gray-700">검색 결과</span>
              <span className="font-semibold text-sky-600">
                {totalCount.toLocaleString()}
              </span>
              <span className="text-gray-500">개</span>
            </div>

            {/* 정렬 선택 */}
            <div className="relative flex items-center">
              <select
                value={sortOrder}
                onChange={(e) =>
                  setSortOrder(e.target.value as PublicSearchSort)
                }
                aria-label="검색 결과 정렬"
                className="cursor-pointer appearance-none bg-transparent pr-5 text-sm text-gray-500 outline-none"
              >
                <option value="latest">최신순</option>
                <option value="oldest">오래된순</option>
              </select>

              <ChevronDown className="pointer-events-none absolute right-0 size-4 text-gray-500" />
            </div>
          </div>
        )}

        {/* 최초 검색 실패 */}
        {isInitialError && <GlobalError className="h-80" />}

        {/* 검색 결과 */}
        {hasKeyword && posts.length > 0 && (
          <>
            <section className="space-y-15">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  highlightKeyword={debouncedKeyword}
                />
              ))}
            </section>

            {/* 다음 페이지 감지 */}
            {hasNextPage && !isPlaceholderData && (
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
            {!hasNextPage && !isFetching && !isPlaceholderData && (
              <div className="pt-10 pb-20 text-center">
                <p className="text-sm text-gray-400">- 마지막 게시물 -</p>
              </div>
            )}
          </>
        )}

        {/* 검색 결과 없음 */}
        {isEmpty && (
          <div className="flex flex-col items-center gap-3 pt-25">
            <SearchX className="size-11 text-gray-300" strokeWidth={1.5} />
            <p className="text-gray-500">검색 결과가 없습니다.</p>
          </div>
        )}

        {/* 검색 로딩 오버레이 */}
        {isSearchLoading && (
          <div
            className={`absolute inset-0 z-10 ${
              posts.length > 0 ? "bg-white/80" : "bg-white"
            }`}
          >
            <div className="flex justify-center pt-24">
              <TailChase size="25" speed="1.75" color="#9ca3af" />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
