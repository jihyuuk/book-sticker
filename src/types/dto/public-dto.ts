// 공개 API DTO

// Classroom
export type PublicClassroom = {
  id: string;
  name: string;
  publicId: string;
};

// Kid
export type PublicKid = {
  id: string;
  name: string;
  profileImageUrl: string | null;
  bookCount: number;
};
