import type { BookInfoData } from "@/components/book/book-info";
import { supabase } from "@/lib/supabse";

export type BookByIsbnResponse =
  | {
      status: "FOUND";
      book: BookInfoData;
    }
  | {
      status: "FOUND_WITHOUT_COVER";
      book: BookInfoData;
    }
  | {
      status: "BOOK_NOT_FOUND";
      book: null;
    };

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
