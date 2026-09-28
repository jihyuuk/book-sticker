import { useMutation } from "@tanstack/react-query";
import { fetchBookByIsbn } from "@/api/book-api";

export function useBookByIsbn() {
  return useMutation({
    mutationFn: fetchBookByIsbn,
  });
}
