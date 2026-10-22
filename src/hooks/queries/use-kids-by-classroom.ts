import { fetchKidsByClassroom } from "@/api/kid-api";
import { QUERY_KEYS } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";

export function useKidsByClassroom(classroomId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.kid.list2(classroomId),
    queryFn: () => fetchKidsByClassroom(classroomId),
    enabled: !!classroomId,
  });
}
