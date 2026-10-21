import { useQuery } from "@tanstack/react-query";
import { fetchAdminChart } from "@/api/chart-api";
import { QUERY_KEYS } from "@/lib/query-keys";

export function useAdminChart(classroomId?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.chart.admin(classroomId ?? ""),
    queryFn: () => fetchAdminChart(classroomId!),
    enabled: !!classroomId,
  });
}
