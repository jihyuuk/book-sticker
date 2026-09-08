import { fetchPublicKids } from "@/api/public-api";
import { QUERY_KEYS } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";

export function usePublicKids(publicId?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.publicKids(publicId ?? ""),
    queryFn: () => fetchPublicKids(publicId!),
    enabled: !!publicId,
  });
}
