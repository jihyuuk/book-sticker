import { useMutation, useQueryClient } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/lib/query-keys";
import { deletePostByAdmin, type AdminPost } from "@/api/admin-post-api";

export function useDeletePostByAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePostByAdmin,

    onSuccess: (_, postId) => {
      queryClient.setQueriesData<AdminPost[]>(
        {
          queryKey: QUERY_KEYS.adminPosts.all,
        },
        (old) => {
          if (!old) return old;

          return old.filter((post) => post.id !== postId);
        },
      );
    },
  });
}
