import type { Tables } from "@/database.types";

export type Classroom = Tables<"classroom">;
export type Kid = Tables<"kid">;

export type KidSummary = Pick<Kid, "id" | "name" | "book_count">;

export type Book = Tables<"book">;
export type Post = Tables<"post">;
