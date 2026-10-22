import { useQuery } from "@tanstack/react-query";
import { fetchPublicChart } from "@/api/chart-api";
import { PUBLIC_QUERY_KEYS } from "@/lib/query-keys/public-query-keys";

export function usePublicChart(publicId?: string) {
  return useQuery({
    queryKey: PUBLIC_QUERY_KEYS.charts.byPublicId(publicId!),
    queryFn: () => fetchPublicChart(publicId!),
    enabled: !!publicId,
  });
}
