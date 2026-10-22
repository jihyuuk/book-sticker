import { fetchKidsByClassroom } from "@/api/kid-api";
import { ADMIN_QUERY_KEYS } from "@/lib/query-keys/admin-query-keys";
import { useQuery } from "@tanstack/react-query";

export function useKidsByClassroom(classroomId: string) {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.kids.byClassroom(classroomId),
    queryFn: () => fetchKidsByClassroom(classroomId),
    enabled: !!classroomId,
  });
}
