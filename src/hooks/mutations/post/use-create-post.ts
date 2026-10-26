import { createPost } from "@/api/post-api";
import { PUBLIC_QUERY_KEYS } from "@/lib/query-keys/public-query-keys";
import type { PostListData } from "@/types/data-types";
import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";

// export function useCreatePost() {
//   return useMutation({
//     mutationFn: async (params: CreatePostParam) => {
//       const cover = params.book.coverImageFile;

//       alert(
//         [
//           `책 표지: ${cover ? (cover.size / 1024).toFixed(2) + " KB" : "파일 없음 (외부 URL)"}`,
//           "",
//           ...params.images.map(
//             (image, index) =>
//               `게시글 이미지 ${index + 1}: ${(image.size / 1024).toFixed(2)} KB`,
//           ),
//         ].join("\n"),
//       );

//       return createPost(params);
//     },
//   });
// }

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPost,
    onSuccess: (_, variables) => {
      const queryKey = PUBLIC_QUERY_KEYS.posts.list(variables.publicId);

      // 첫 페이지만 남기기
      queryClient.setQueryData<InfiniteData<PostListData>>(queryKey, (old) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.slice(0, 1),
          pageParams: old.pageParams.slice(0, 1),
        };
      });

      // 백그라운드 리패칭
      void queryClient.invalidateQueries({
        queryKey,
        exact: true,
        refetchType: "all",
      });
    },
  });
}
