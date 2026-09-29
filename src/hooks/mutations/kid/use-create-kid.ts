import { createKid } from "@/api/kid-api";
import { QUERY_KEYS } from "@/lib/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateKid() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createKid,
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.settingClassroom(variables.classroom_id),
      });
    },
  });
}
