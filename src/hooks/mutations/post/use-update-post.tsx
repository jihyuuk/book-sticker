import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updatePost, type UpdatePostParam } from "@/api/post-api";
import { QUERY_KEYS } from "@/lib/query-keys";
import { optimizePostImage } from "@/lib/optimize-post-image";
import type { PostListData } from "@/types/data-types";

export function useUpdatePost(publicId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: UpdatePostParam) => {
      // 새 이미지만 최적화
      const optimizedImages = await Promise.all(
        params.images.map(async (image) => {
          if (image.type === "existing") {
            return image;
          }

          return {
            ...image,
            file: await optimizePostImage(image.file),
          };
        }),
      );

      // api 호출
      return updatePost({
        ...params,
        images: optimizedImages,
      });
    },

    onSuccess: (data) => {
      if (!publicId) return;

      queryClient.setQueryData<PostListData>(
        QUERY_KEYS.publicPosts(publicId),
        (old) => {
          if (!old) return old;

          return {
            ...old,
            posts: old.posts.map((post) =>
              post.id === data.postId
                ? {
                    ...post,
                    content: data.content,
                    images: data.images,
                  }
                : post,
            ),
          };
        },
      );
    },
  });
}
