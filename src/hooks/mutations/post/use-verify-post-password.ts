import { verifyPostPassword } from "@/api/post-api";
import { useMutation } from "@tanstack/react-query";

export function useVerifyPostPassword() {
  return useMutation({
    mutationFn: verifyPostPassword,
  });
}
