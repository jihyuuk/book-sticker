import { deleteKid } from "@/api/kid-api";
import { QUERY_KEYS } from "@/lib/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteKid() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteKid,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.kid.list,
      });
    },
  });
}
