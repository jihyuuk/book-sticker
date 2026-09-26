import { createPost, type CreatePostParam } from "@/api/post-api";
import { optimizePostImage } from "@/lib/optimize-post-image";
import { useMutation } from "@tanstack/react-query";

export function useCreatePost() {
  return useMutation({
    mutationFn: async (params: CreatePostParam) => {
      //이미지 최적화
      const optimizedImages = await Promise.all(
        params.images.map((image) => optimizePostImage(image)),
      );

      //api 호출
      return createPost({
        ...params,
        images: optimizedImages,
      });
    },
  });
}
