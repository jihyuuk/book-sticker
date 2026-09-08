import { createPost } from "@/api/post-api";
import { useMutation } from "@tanstack/react-query";

export function useCreatePost() {
  return useMutation({
    mutationFn: createPost,
  });
}
