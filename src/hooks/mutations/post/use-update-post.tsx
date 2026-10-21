import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updatePost } from "@/api/post-api";
import { QUERY_KEYS } from "@/lib/query-keys";

export function useUpdatePost(publicId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    // PostImageField에서 이미 최적화했으므로 바로 API 호출
    mutationFn: updatePost,

    onSuccess: () => {
      if (!publicId) return;

      // 공개 게시글 목록 캐시 무효화 및 재조회 유도
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.publicPosts(publicId),
      });
    },
  });
}
