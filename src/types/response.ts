import type { BookInfoData } from "@/components/book/book-info";

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
