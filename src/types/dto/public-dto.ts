// 공개 API DTO

// Classroom
export type PublicClassroom = {
  id: string;
  name: string | null; // not null 설정 해야함
  publicId: string;
};

// Kid
export type PublicKid = {
  id: string;
  name: string;
  profileImageUrl: string | null;
  bookCount: number;
};

// Post
export type PublicPost = {
  id: string;
  content: string | null; // not null 설정 해야함
  images: Image[];
  kid: Omit<PublicKid, "bookCount">;
  book: PublicBook;
  createdAt: string;
  updatedAt: string;
};

// Post Page
export type PublicPostsPageData = {
  classroom: PublicClassroom;
  posts: PublicPost[];
  nextCursor: string | null;
};

// Book
export type PublicBook = {
  id: string;
  title: string;
  author: string | null;
  publisher: string | null;
  isbn: string | null;
  coverUrl: string | null;
};

// Image
export type Image = {
  id: string;
  imageUrl: string;
};
