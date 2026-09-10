import PostHeader from "./post-header";
import PostBookInfo from "./post-book-info";
import PostCaption from "./post-caption";
import PostImageCarousel from "./post-image-carousel";
import type { PublicPost } from "@/public-types";

type Props = {
  post: PublicPost;
};

const mockImages = [
  // 가로 4:3
  "https://picsum.photos/seed/mock-1/800/600",

  // 세로 3:4
  "https://picsum.photos/seed/mock-2/600/800",

  // 정사각형
  "https://picsum.photos/seed/mock-3/700/700",

  // 가로 16:9
  "https://picsum.photos/seed/mock-4/960/540",

  // 세로형 긴 사진
  "https://picsum.photos/seed/mock-5/600/1000",
];

export default function PostCard({ post }: Props) {
  return (
    <article key={post.id} className="bg-white pb-5 shadow-sm">
      {/* 헤더 */}
      <PostHeader post={post} />

      {/* 피드 이미지 */}
      <PostImageCarousel images={mockImages} />

      {/* 책 정보 */}
      <PostBookInfo book={post.book} />

      {/* 독서 기록 */}
      <PostCaption caption={post.content} />
    </article>
  );
}
