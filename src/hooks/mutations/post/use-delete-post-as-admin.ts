import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/query-keys";
import { deletePostAsAdmin } from "@/api/admin-post-api";

export function useDeletePostAsAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePostAsAdmin,

    //리팩토링 고려 새로고침이 아닌 해당값만 지우게
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.adminPosts.all,
      });
    },
  });
}
