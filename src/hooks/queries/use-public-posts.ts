import { fetchPublicPosts } from "@/api/public-api";
import { QUERY_KEYS } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";

export function usePublicPosts(publicId?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.publicPosts(publicId ?? ""),
    queryFn: () => fetchPublicPosts(publicId!),
    enabled: !!publicId,
  });
}
