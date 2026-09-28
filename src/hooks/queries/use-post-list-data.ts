import { fetchPostListData } from "@/api/post-api";
import { QUERY_KEYS } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";

export function usePostListData(publicId?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.publicPosts(publicId ?? ""),
    queryFn: () => fetchPostListData(publicId!),
    enabled: !!publicId,
  });
}
