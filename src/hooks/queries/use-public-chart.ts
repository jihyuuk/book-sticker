import { useQuery } from "@tanstack/react-query";
import { fetchPublicChart } from "@/api/chart-api";
import { QUERY_KEYS } from "@/lib/query-keys";

export function usePublicChart(publicId?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.chart.public(publicId ?? ""),
    queryFn: () => fetchPublicChart(publicId!),
    enabled: !!publicId,
  });
}
