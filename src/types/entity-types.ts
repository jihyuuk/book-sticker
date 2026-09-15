import type { Tables, TablesInsert, TablesUpdate } from "@/database.types";

export type Classroom = Tables<"classroom">;
export type Kid = Tables<"kid">;
export type KidInsert = TablesInsert<"kid">;
export type KidUpdate = TablesUpdate<"kid">;

export type KidSummary = Pick<Kid, "id" | "name" | "book_count">;

export type Book = Tables<"book">;
export type Post = Tables<"post">;
