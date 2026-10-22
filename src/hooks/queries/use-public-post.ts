import { fetchPublicPosts } from "@/api/post-api";
import { PUBLIC_QUERY_KEYS } from "@/lib/query-keys/public-query-keys";
import { useInfiniteQuery } from "@tanstack/react-query";

export function usePublicPosts(publicId?: string) {
  return useInfiniteQuery({
    queryKey: PUBLIC_QUERY_KEYS.posts.list(publicId!),

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
