import { useQuery } from "@tanstack/react-query";
import { PUBLIC_QUERY_KEYS } from "@/lib/query-keys/public-query-keys";
import { fetchPublicChart } from "@/api/chart-api";

export function usePublicChart(publicId?: string) {
  return useQuery({
    queryFn: () => fetchPublicChart(publicId!),
    queryKey: PUBLIC_QUERY_KEYS.chart(publicId ?? ""),
    enabled: !!publicId,
  });
}
