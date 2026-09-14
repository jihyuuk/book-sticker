import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deletePost } from "@/api/post-api";
import { QUERY_KEYS } from "@/lib/query-keys";
import type { PublicPostListData } from "@/public-types";

export function useDeletePost(publicId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePost,

    onSuccess: (_, variables) => {
      if (!publicId) return;

      queryClient.setQueryData<PublicPostListData>(
        QUERY_KEYS.publicPosts(publicId),
        (old) => {
          if (!old) return old;

          return {
            ...old,
            posts: old.posts.filter((post) => post.id !== variables.postId),
          };
        },
      );
    },
  });
}
