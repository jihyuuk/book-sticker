import { useQuery } from "@tanstack/react-query";
import { fetchAdminChart } from "@/api/chart-api";
import { ADMIN_QUERY_KEYS } from "@/lib/query-keys/admin-query-keys";

export function useAdminChart(classroomId?: string) {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.charts.byClassroom(classroomId!),
    queryFn: () => fetchAdminChart(classroomId!),
    enabled: !!classroomId,
  });
}
