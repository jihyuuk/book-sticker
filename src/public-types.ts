import type { Book, Classroom, Kid, Post } from "./types";

export type PublicClassroom = Pick<Classroom, "id" | "name" | "public_id">;

export type PublicKid = Pick<Kid, "id" | "name" | "profile_image_url">;

export type PublicChartKid = PublicKid & {
  book_count: number;
};

export type PublicBook = Pick<
  Book,
  "id" | "isbn" | "title" | "author" | "publisher" | "cover_url"
>;

// ============================================================
// 공개 게시글 타입
// ============================================================

export type PublicPost = Pick<
  Post,
  "id" | "content" | "created_at" | "updated_at"
> & {
  kid: PublicKid;
  book: PublicBook;
  images: string[];
};

// ============================================================
// 공개 페이지 / RPC 응답 타입
// ============================================================

// /classroom/:publicId/chart
export type PublicChartData = {
  classroom: PublicClassroom;
  kids: PublicChartKid[];
};

// /classroom/:publicId/posts/new
export type PublicKidListData = {
  classroom: PublicClassroom;
  kids: PublicKid[];
};

// /classroom/:publicId/posts
export type PublicPostListData = {
  classroom: PublicClassroom;
  posts: PublicPost[];
};
