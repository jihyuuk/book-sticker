import { fetchKids } from "@/api/kid-api";
import { QUERY_KEYS } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";

export function useKids() {
  return useQuery({
    queryKey: QUERY_KEYS.kid.list,
    queryFn: fetchKids,
  });
}
