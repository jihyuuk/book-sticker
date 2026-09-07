import { resendVerificationEmail } from "@/api/auth-api";
import { useMutation } from "@tanstack/react-query";

export function useResendVerificationEmail() {
  return useMutation({
    mutationFn: resendVerificationEmail,
  });
}
