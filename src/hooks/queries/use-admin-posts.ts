import { fetchAdminPosts } from "@/api/admin-post-api";
import { QUERY_KEYS } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";

export function useAdminPosts(classroomId: string | null | undefined) {
  return useQuery({
    queryKey: QUERY_KEYS.adminPosts(classroomId ?? null),
    queryFn: () => fetchAdminPosts(classroomId ?? null),
    enabled: classroomId !== undefined,
  });
}
