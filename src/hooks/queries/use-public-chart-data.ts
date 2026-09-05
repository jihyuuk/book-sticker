import { fetchPublicChartData } from "@/api/public-api";
import { QUERY_KEYS } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";

export function usePublicChartData(publicId?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.publicChart(publicId!),
    queryFn: () => fetchPublicChartData(publicId!),
    enabled: !!publicId,
  });
}
