import { supabase } from "@/lib/supabse";
import type { BookByIsbnResponse } from "@/types/response";

export async function fetchBookByIsbn(isbn: string) {
  const { data, error } = await supabase.functions.invoke<BookByIsbnResponse>(
    "fetch-book-by-isbn",
    {
      body: { isbn },
    },
  );

  if (error) throw error;
  if (!data) throw new Error("책 조회 응답이 없습니다.");

  return data;
}
