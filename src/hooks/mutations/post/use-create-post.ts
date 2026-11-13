import { createPost } from "@/api/post-api";
import type { CreatePostOptions } from "@/api/post-api";
import { PUBLIC_QUERY_KEYS } from "@/lib/query-keys/public-query-keys";
import type { PostListData } from "@/types/data-types";
import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";

export function useCreatePost(options: CreatePostOptions = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: Parameters<typeof createPost>[0]) =>
      createPost(params, options),
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
