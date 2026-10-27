import { deleteClassroom, fetchClassrooms } from "@/api/classroom-api";
import { ADMIN_QUERY_KEYS } from "@/lib/query-keys/admin-query-keys";
import { clearAdminPostsAndChart } from "@/lib/query-keys/remove-cache";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteClassroom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteClassroom,

    onSuccess: (_, classroomId) => {
      // 반 목록에서 삭제
      queryClient.setQueryData<Awaited<ReturnType<typeof fetchClassrooms>>>(
        ADMIN_QUERY_KEYS.classrooms.list,
        (old) => {
          if (!old) return old;

          return old.filter((classroom) => classroom.id !== classroomId);
        },
      );

      // 반 상세 캐시 삭제
      queryClient.removeQueries({
        queryKey: ADMIN_QUERY_KEYS.classrooms.detail(classroomId),
        exact: true,
      });

      // 해당 반의 원아 목록 캐시 삭제
      queryClient.removeQueries({
        queryKey: ADMIN_QUERY_KEYS.kids.byClassroom(classroomId),
        exact: true,
      });

      // posts,chart 캐싱 지우기
      clearAdminPostsAndChart(queryClient);
    },
  });
}
