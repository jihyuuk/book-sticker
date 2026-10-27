import { fetchClassrooms } from "@/api/classroom-api";
import { ADMIN_QUERY_KEYS } from "@/lib/query-keys/admin-query-keys";
import { useQuery } from "@tanstack/react-query";

export function useClassrooms() {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.classrooms.list,
    queryFn: fetchClassrooms,
    staleTime: 1000 * 60 * 5, //5분
  });
}
