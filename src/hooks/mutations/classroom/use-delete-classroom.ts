import { deleteClassroom2 } from "@/api/classroom-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteClassroom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteClassroom2,

    onSuccess: () => {
      // 반 목록 갱신
      void queryClient.invalidateQueries({
        queryKey: ["classrooms"],
      });
    },
  });
}
