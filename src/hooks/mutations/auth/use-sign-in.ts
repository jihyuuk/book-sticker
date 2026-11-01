import { signIn } from "@/api/auth-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useSignIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signIn,
    onSuccess: () => {
      // 로그인 성공 시 모든 캐시 초기화
      queryClient.clear();
    },
  });
}
