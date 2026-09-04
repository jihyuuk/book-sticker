import { updateKid } from "@/api/kid-api";
import { QUERY_KEYS } from "@/lib/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateKid() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateKid,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.kid.list });
    },
  });
}
