import { signUp } from "@/api/auth-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useSignUp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signUp,
    onSuccess: () => {
      toast.success("회원가입을 축하드립니다.");
      // 회원가입 시 모든 캐시 초기화
      queryClient.clear();
    },
  });
}
