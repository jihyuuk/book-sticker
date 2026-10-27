import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePostAsAdmin } from "@/api/admin-post-api";
import { ADMIN_QUERY_KEYS } from "@/lib/query-keys/admin-query-keys";

export function useDeletePostAsAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePostAsAdmin,

    //리팩토링 고려 새로고침이 아닌 해당값만 지우게
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: ADMIN_QUERY_KEYS.posts.all,
      });
    },
  });
}
