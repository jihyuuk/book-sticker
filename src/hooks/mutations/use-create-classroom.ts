import { createClassroom } from "@/api/classroom-api";
import { useMutation } from "@tanstack/react-query";

export function useCreateClassroom() {
  return useMutation({
    mutationFn: createClassroom,
  });
}
