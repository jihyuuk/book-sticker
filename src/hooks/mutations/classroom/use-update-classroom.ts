import { updateClassroom } from "@/api/classroom-api";
import { ADMIN_QUERY_KEYS } from "@/lib/query-keys/admin-query-keys";
import { clearAdminPostsAndChart } from "@/lib/query-keys/remove-cache";
import type { Classroom } from "@/types/entity-types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateClassroom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateClassroom,

    onSuccess: (_, variables) => {
      const { id, ...updates } = variables;

      // 반 상세 캐시 업데이트
      queryClient.setQueryData<Classroom>(
        ADMIN_QUERY_KEYS.classrooms.detail(id),
        (old) => {
          if (!old) return old;

          return { ...old, ...updates };
        },
      );

      // 반 목록 캐시 업데이트
      queryClient.setQueryData<Classroom[]>(
        ADMIN_QUERY_KEYS.classrooms.list,
        (old) => {
          if (!old) return old;

          return old
            .map((classroom) =>
              classroom.id === id ? { ...classroom, ...updates } : classroom,
            )
            .sort((a, b) => (a.name ?? "").localeCompare(b.name ?? "", "ko"));
        },
      );

      // posts,chart 캐싱 지우기
      clearAdminPostsAndChart(queryClient);
    },
  });
}
