import { searchAdminPosts, type AdminSearchSort } from "@/api/admin-search-api";
import { ADMIN_QUERY_KEYS } from "@/lib/query-keys/admin-query-keys";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";

export function useAdminSearchPosts(
  classroomId: string | null,
  keyword: string,
  sort: AdminSearchSort = "latest",
  enabled = true,
) {
  const searchKeyword = keyword.trim();

  return useInfiniteQuery({
    queryKey: ADMIN_QUERY_KEYS.posts.search(classroomId, searchKeyword, sort),

    queryFn: ({ pageParam }) =>
      searchAdminPosts({
        classroomId,
        keyword: searchKeyword,
        sort,
        cursor: pageParam,
      }),

    initialPageParam: null as string | null,

    getNextPageParam: (lastPage) => lastPage.nextCursor ?? null,

    enabled: enabled && searchKeyword.length > 0 && searchKeyword.length <= 100,

    placeholderData: keepPreviousData,

    staleTime: 30 * 1000, // 30초
    gcTime: 15 * 60 * 1000, // 15분
  });
}
