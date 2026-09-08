import { searchBooksByTitle } from "@/api/book-api";
import { QUERY_KEYS } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";

export function useBookSearch(title: string) {
  return useQuery({
    queryKey: QUERY_KEYS.book.searchByTitle(title),
    queryFn: () => searchBooksByTitle(title),
    enabled: !!title.trim(),
  });
}
