import { updateClassroom } from "@/api/setting-api";
import { QUERY_KEYS } from "@/lib/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateClassroom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateClassroom,

    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.settingClassroom(variables.id),
        }),

        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.setting,
        }),
      ]);
    },
  });
}
