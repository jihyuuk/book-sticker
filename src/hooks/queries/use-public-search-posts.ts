import {
  searchPublicPosts,
  type PublicSearchSort,
} from "@/api/public-search-api";
import { PUBLIC_QUERY_KEYS } from "@/lib/query-keys/public-query-keys";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";

export function usePublicSearchPosts(
  publicId?: string,
  keyword: string = "",
  sort: PublicSearchSort = "latest",
) {
  const searchKeyword = keyword.trim();

  return useInfiniteQuery({
    placeholderData: keepPreviousData,

    queryKey: PUBLIC_QUERY_KEYS.posts.search(
      publicId ?? "",
      searchKeyword,
      sort,
    ),

    queryFn: ({ pageParam }) =>
      searchPublicPosts({
        publicId: publicId!,
        keyword: searchKeyword,
        sort,
        cursor: pageParam,
      }),

    initialPageParam: null as string | null,

    getNextPageParam: (lastPage) => lastPage?.nextCursor ?? null,

    enabled: !!publicId && !!searchKeyword,

    staleTime: 30 * 1000, // 30초
    gcTime: 15 * 60 * 1000, // 15분
  });
}
