import { fetchAdminPosts } from "@/api/admin-post-api";
import { QUERY_KEYS } from "@/lib/query-keys";
import { useInfiniteQuery } from "@tanstack/react-query";

export function useAdminPosts(classroomId: string | null, enabled = true) {
  return useInfiniteQuery({
    queryKey: QUERY_KEYS.adminPosts.list(classroomId),

    queryFn: ({ pageParam }) =>
      fetchAdminPosts({
        classroomId,
        cursor: pageParam,
      }),

    initialPageParam: null as string | null,

    getNextPageParam: (lastPage) => lastPage.nextCursor,

    enabled,
  });
}
