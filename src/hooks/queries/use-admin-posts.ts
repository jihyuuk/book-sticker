import { fetchAdminPosts } from "@/api/admin-post-api";
import { ADMIN_QUERY_KEYS } from "@/lib/query-keys/admin-query-keys";
import { useInfiniteQuery } from "@tanstack/react-query";

export function useAdminPosts(classroomId: string | null, enabled = true) {
  return useInfiniteQuery({
    queryKey: ADMIN_QUERY_KEYS.posts.byClassroom(classroomId),

    queryFn: ({ pageParam }) =>
      fetchAdminPosts({
        classroomId,
        cursor: pageParam,
      }),

    initialPageParam: null as string | null,

    getNextPageParam: (lastPage) => lastPage.nextCursor,

    enabled,

    staleTime: Infinity, //리패칭 방지
    gcTime: 15 * 60 * 1000, // 15분
  });
}
