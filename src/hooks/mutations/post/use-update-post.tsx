import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updatePost } from "@/api/post-api";
import { QUERY_KEYS } from "@/lib/query-keys";
import type { PostListData } from "@/types/data-types";

export function useUpdatePost(publicId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePost,

    onSuccess: (_, variables) => {
      if (!publicId) return;

      queryClient.setQueryData<PostListData>(
        QUERY_KEYS.publicPosts(publicId),
        (old) => {
          if (!old) return old;

          return {
            ...old,
            posts: old.posts.map((post) =>
              post.id === variables.postId
                ? {
                    ...post,
                    content: variables.content,
                  }
                : post,
            ),
          };
        },
      );
    },
  });
}
