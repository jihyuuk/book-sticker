import type { Book, Classroom, Kid, Post } from "./types";

export type PublicClassroom = Pick<Classroom, "id" | "name" | "public_id">;

export type PublicKid = Pick<Kid, "id" | "name" | "book_count">;

export type PublicBook = Pick<
  Book,
  "id" | "isbn" | "title" | "author" | "publisher" | "cover_url"
>;

// ============================================================
// 공개 게시글 타입
// ============================================================

// 게시글 목록용
export type PublicPostSummary = Pick<
  Post,
  "id" | "content" | "created_at" | "updated_at"
> & {
  kid: PublicKid;
  book: PublicBook;
};

// 게시글 상세용
export type PublicPostDetail = Pick<
  Post,
  "id" | "content" | "created_at" | "updated_at"
> & {
  kid: PublicKid;
  book: PublicBook;
};

// ============================================================
// 공개 페이지 / RPC 응답 타입
// ============================================================

// /classroom/:publicId/chart
export type PublicChartData = {
  classroom: PublicClassroom;
  kids: PublicKid[];
};

// /classroom/:publicId/posts/new
export type PublicKidListData = {
  classroom: PublicClassroom;
  kids: PublicKid[];
};

// /classroom/:publicId/posts
export type PublicPostListData = {
  classroom: PublicClassroom;
  posts: PublicPostSummary[];
};

// /classroom/:publicId/posts/:postId
export type PublicPostDetailData = {
  classroom: PublicClassroom;
  post: PublicPostDetail;
};
