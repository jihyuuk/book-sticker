import { signUp } from "@/api/auth-api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function useSignUp() {
  return useMutation({
    mutationFn: signUp,
    onSuccess: () => {
      toast.success("회원가입을 축하드립니다.");
    },
  });
}
