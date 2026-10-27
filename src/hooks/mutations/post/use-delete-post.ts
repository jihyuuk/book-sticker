import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";

import { deletePost } from "@/api/post-api";
import type { PostListData } from "@/types/data-types";
import { PUBLIC_QUERY_KEYS } from "@/lib/query-keys/public-query-keys";

export function useDeletePost(publicId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePost,

    onSuccess: (_, variables) => {
      if (!publicId) return;

      queryClient.setQueryData<InfiniteData<PostListData>>(
        PUBLIC_QUERY_KEYS.posts.list(publicId),
        (old) => {
          if (!old) return old;

          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              posts: page.posts.filter((post) => post.id !== variables.postId),
            })),
          };
        },
      );
    },
  });
}
