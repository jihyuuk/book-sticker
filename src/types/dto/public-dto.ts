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
};

// Post
export type PublicPost = {
  id: string;
  content: string | null; // not null 설정 해야함
  images: Image[];
  kid: PublicKid;
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

// Post 생성에 필요한 데이터
export type PostCreateData = {
  classroom: PublicClassroom;
  kids: (PublicKid & {
    todayPostCount: number;
  })[];
  dailyBookLimit: number;
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

// Chart Kid - 차트 전용 정보
export type ChartKid = PublicKid & {
  bookCount: number;
  postCount: number;
  totalCount: number;
};

// Chart 데이터
export type PublicChart = {
  classroom: PublicClassroom;
  chartKids: ChartKid[];
};
