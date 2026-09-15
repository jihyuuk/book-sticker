import type {
  PublicChartKid,
  PublicClassroom,
  PublicKid,
  PublicPost,
} from "./public-types";

// /classroom/:publicId/chart
export type ChartData = {
  classroom: PublicClassroom;
  kids: PublicChartKid[];
};

// /classroom/:publicId/posts/new
export type PostCreateData = {
  classroom: PublicClassroom;
  kids: PublicKid[];
};

// /classroom/:publicId/posts
export type PostListData = {
  classroom: PublicClassroom;
  posts: PublicPost[];
};
