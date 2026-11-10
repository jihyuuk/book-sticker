import { updatePost } from "@/api/post-api";
import { PUBLIC_QUERY_KEYS } from "@/lib/query-keys/public-query-keys";
import type { PostListData } from "@/types/data-types";
import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";

export function useUpdatePost(publicId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePost,

    onSuccess: (updatedPost) => {
      if (!publicId) return;

      const queryKey = PUBLIC_QUERY_KEYS.posts.list(publicId);
      const updatedAt = new Date().toISOString();

      queryClient.setQueryData<InfiniteData<PostListData>>(queryKey, (old) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            posts: page.posts.map((post) =>
              post.id === updatedPost.postId
                ? {
                    ...post,
                    content: updatedPost.content,
                    images: updatedPost.images,
                    updatedAt: updatedAt,
                  }
                : post,
            ),
          })),
        };
      });
    },
  });
}
