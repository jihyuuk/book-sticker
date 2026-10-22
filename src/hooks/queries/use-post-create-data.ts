import { fetchPostCreateData } from "@/api/post-api";
import { PUBLIC_QUERY_KEYS } from "@/lib/query-keys/public-query-keys";
import { useQuery } from "@tanstack/react-query";

export function usePostCreateData(publicId?: string) {
  return useQuery({
    queryKey: PUBLIC_QUERY_KEYS.posts.createData(publicId!),
    queryFn: () => fetchPostCreateData(publicId!),
    enabled: !!publicId,
  });
}
