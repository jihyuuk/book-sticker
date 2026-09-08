import { signUp } from "@/api/auth-api";
import { useMutation } from "@tanstack/react-query";

export function useSignUp() {
  return useMutation({
    mutationFn: signUp,
  });
}
