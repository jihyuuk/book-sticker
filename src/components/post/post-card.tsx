import PostHeader from "./post-header";
import PostBookInfo from "./post-book-info";
import PostCaption from "./post-caption";
import PostImageCarousel from "./post-image-carousel";

export type TempProps = {
  post: {
    id: string;
    kidName: string;
    profileImage: string | null;
    createdAt: string;
    content: string;
    images: string[];
    book: {
      isbn: string | null;
      title: string;
      author: string | null;
      publisher: string | null;
      coverUrl: string | null;
    };
  };
};

export default function PostCard({ post }: TempProps) {
  return (
    <article key={post.id} className="bg-white pb-5 shadow-sm">
      {/* 헤더 */}
      <PostHeader post={post} />

      {/* 피드 이미지 */}
      <PostImageCarousel images={post.images} />

      {/* 책 정보 */}
      <PostBookInfo post={post} />

      {/* 독서 기록 */}
      <PostCaption post={post} />
    </article>
  );
}
