import { createClassroom2 } from "@/api/classroom-api";
import { QUERY_KEYS } from "@/lib/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateClassroom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createClassroom2,

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.classroom.list,
        }),
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.setting,
        }),
      ]);
    },
  });
}
