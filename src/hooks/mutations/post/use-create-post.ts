import { createPost, type CreatePostParam } from "@/api/post-api";
import { useMutation } from "@tanstack/react-query";

export function useCreatePost() {
  return useMutation({
    mutationFn: async (params: CreatePostParam) => {
      const cover = params.book.coverImageFile;

      alert(
        [
          `책 표지: ${cover ? (cover.size / 1024).toFixed(2) + " KB" : "파일 없음 (외부 URL)"}`,
          "",
          ...params.images.map(
            (image, index) =>
              `게시글 이미지 ${index + 1}: ${(image.size / 1024).toFixed(2)} KB`,
          ),
        ].join("\n"),
      );

      return createPost(params);
    },
  });
}
