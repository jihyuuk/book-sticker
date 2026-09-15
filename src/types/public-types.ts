import type { Book, Classroom, Kid, Post } from "./entity-types";

export type PublicClassroom = Pick<Classroom, "id" | "name" | "public_id">;

export type PublicKid = Pick<Kid, "id" | "name" | "profile_image_url">;

export type PublicChartKid = PublicKid & {
  book_count: number;
};

export type PublicBook = Pick<
  Book,
  "id" | "isbn" | "title" | "author" | "publisher" | "cover_url"
>;

export type PublicPost = Pick<
  Post,
  "id" | "content" | "created_at" | "updated_at"
> & {
  kid: PublicKid;
  book: PublicBook;
  images: string[];
};
