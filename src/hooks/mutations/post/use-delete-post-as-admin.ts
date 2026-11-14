import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";

import { deletePostAsAdmin } from "@/api/admin-post-api";
import { ADMIN_QUERY_KEYS } from "@/lib/query-keys/admin-query-keys";

type AdminPostPage = {
  posts: { id: string }[];
  nextCursor: string | null;
};

export function useDeletePostAsAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePostAsAdmin,

    onSuccess: (_, postId) => {
      queryClient.setQueriesData<InfiniteData<AdminPostPage>>(
        { queryKey: ADMIN_QUERY_KEYS.posts.all },
        (old) => {
          if (!old) return old;

          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              posts: page.posts.filter((post) => post.id !== postId),
            })),
          };
        },
      );
    },
  });
}
