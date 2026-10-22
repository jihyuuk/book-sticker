import { fetchClassroom } from "@/api/classroom-api";
import { ADMIN_QUERY_KEYS } from "@/lib/query-keys/admin-query-keys";
import { useQuery } from "@tanstack/react-query";

// 반 단건 조회
export function useClassroom(classroomId: string) {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.classrooms.detail(classroomId),
    queryFn: () => fetchClassroom(classroomId),
    enabled: !!classroomId,
  });
}
