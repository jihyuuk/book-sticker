import { fetchClassroom } from "@/api/classroom-api";
import { QUERY_KEYS } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";

// 반 단건 조회
export function useClassroom(classroomId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.classroom.detail(classroomId),
    queryFn: () => fetchClassroom(classroomId),
    enabled: !!classroomId,
  });
}
