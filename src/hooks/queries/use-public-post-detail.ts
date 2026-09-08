import { fetchPublicPostDetail } from "@/api/public-api";
import { QUERY_KEYS } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";

export function usePublicPostDetail(publicId?: string, postId?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.publicPostDetail(publicId ?? "", postId ?? ""),

    queryFn: () =>
      fetchPublicPostDetail({
        publicId: publicId!,
        postId: postId!,
      }),

    enabled: !!publicId && !!postId,
  });
}
