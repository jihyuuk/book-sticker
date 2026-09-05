import type { Tables, TablesInsert, TablesUpdate } from "@/database.types";

export type Classroom = Tables<"classroom">;
export type ClassroomInsert = TablesInsert<"classroom">;
export type ClassroomUpdate = TablesUpdate<"classroom">;

export type Kid = Tables<"kid">;
export type KidInsert = TablesInsert<"kid">;
export type KidUpdate = TablesUpdate<"kid">;

export type KidSummary = Pick<Kid, "id" | "name" | "book_count">;
export type PublicChartData = Pick<Classroom, "id" | "name" | "public_id"> & {
  kids: KidSummary[];
};
