import { fetchClassrooms } from "@/api/classroom-api";
import { QUERY_KEYS } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";

export function useClassrooms() {
  return useQuery({
    queryKey: QUERY_KEYS.classroom.list,
    queryFn: fetchClassrooms,
  });
}
