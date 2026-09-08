import type { Tables, TablesInsert, TablesUpdate } from "@/database.types";

export type Classroom = Tables<"classroom">;
export type ClassroomInsert = TablesInsert<"classroom">;
export type ClassroomUpdate = TablesUpdate<"classroom">;

export type Kid = Tables<"kid">;
export type KidInsert = TablesInsert<"kid">;
export type KidUpdate = TablesUpdate<"kid">;

export type KidSummary = Pick<Kid, "id" | "name" | "book_count">;

export type Book = Tables<"book">;
export type BookInsert = TablesInsert<"book">;
export type BookUpdate = TablesUpdate<"book">;

export type Post = Tables<"post">;
export type PostInsert = TablesInsert<"post">;
export type PostUpdate = TablesUpdate<"post">;
