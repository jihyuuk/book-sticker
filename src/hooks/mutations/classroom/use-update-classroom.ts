import { updateClassroom } from "@/api/classroom-api";
import { QUERY_KEYS } from "@/lib/query-keys";
import type { Classroom } from "@/types/entity-types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateClassroom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateClassroom,

    onSuccess: (_, variables) => {
      const { id, ...updates } = variables;

      // 반 단건 캐시 즉시 업데이트
      queryClient.setQueryData<Classroom>(
        QUERY_KEYS.classroom.detail(id),
        (old) => {
          if (!old) return old;

          return {
            ...old,
            ...updates,
          };
        },
      );

      // 반 목록 캐시 무효화
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.classroom.list,
      });

      // 레거시 쿼리 무효화 (추후 제거)
      void queryClient.invalidateQueries({
        queryKey: ["classroom", "byUserId"],
      });
    },
  });
}
