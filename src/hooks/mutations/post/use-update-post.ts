import { updatePost, type UpdatePostOptions } from "@/api/post-api";
import { PUBLIC_QUERY_KEYS } from "@/lib/query-keys/public-query-keys";
import type { PublicPostsPageData } from "@/types/dto/public-dto";
import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";

export function useUpdatePost(
  publicId?: string,
  options: UpdatePostOptions = {},
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: Parameters<typeof updatePost>[0]) =>
      updatePost(params, options),

    onSuccess: ({ post: updatedPost }) => {
      if (!publicId) return;

      queryClient.setQueryData<InfiniteData<PublicPostsPageData>>(
        PUBLIC_QUERY_KEYS.posts.list(publicId),
        (old) => {
          if (!old) return old;

          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              posts: page.posts.map((post) =>
                post.id === updatedPost.id ? updatedPost : post,
              ),
            })),
          };
        },
      );
    },
  });
}
