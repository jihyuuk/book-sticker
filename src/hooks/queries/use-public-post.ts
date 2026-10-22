import { fetchPublicPosts } from "@/api/post-api";
import { QUERY_KEYS } from "@/lib/query-keys";
import { useInfiniteQuery } from "@tanstack/react-query";

export function usePublicPosts(publicId?: string) {
  return useInfiniteQuery({
    queryKey: QUERY_KEYS.publicPosts(publicId ?? ""),

    queryFn: ({ pageParam }) =>
      fetchPublicPosts({
        publicId: publicId!,
        cursor: pageParam,
      }),

    initialPageParam: null as string | null,

    getNextPageParam: (lastPage) => lastPage?.nextCursor ?? null,

    enabled: !!publicId,
  });
}
