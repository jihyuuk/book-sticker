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

      alert(
        optimizedImages
          .map(
            (image, index) =>
              `${index + 1}번: ${(image.size / 1024 / 1024).toFixed(2)} MB`,
          )
          .join("\n"),
      );

      //api 호출
      return createPost({
        ...params,
        images: optimizedImages,
      });
    },
  });
}
