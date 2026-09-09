import { deletePost } from "@/api/post-api";
import { useMutation } from "@tanstack/react-query";

export function useDeletePost() {
  return useMutation({
    mutationFn: deletePost,
  });
}
