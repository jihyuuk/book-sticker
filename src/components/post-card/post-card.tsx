import PostHeader from "./post-header";
import BookInfo from "../book/book-info";
import PostCaption from "./post-caption";
import PostImageCarousel from "./post-image-carousel";
import type { PublicPost } from "@/types/dto/public-dto";

type Props = {
  post: PublicPost;
  //리팩토링- classroom name = not null
  classroomName?: string | null;
  isAdmin?: boolean;
};

// const mockImages = [
//   // 가로 4:3
//   "https://picsum.photos/seed/mock-1/800/600",

//   // 세로 3:4
//   "https://picsum.photos/seed/mock-2/600/800",

//   // 정사각형
//   "https://picsum.photos/seed/mock-3/700/700",

//   // 가로 16:9
//   "https://picsum.photos/seed/mock-4/960/540",

//   // 세로형 긴 사진
//   "https://picsum.photos/seed/mock-5/600/1000",
// ];

export default function PostCard({ post, classroomName, isAdmin }: Props) {
  return (
    <article className="bg-white">
      {/* 헤더 */}
      <PostHeader post={post} classroomName={classroomName} isAdmin={isAdmin} />

      {/* 독서록 */}
      <PostCaption caption={post.content} />

      {/* 피드 이미지 */}
      <PostImageCarousel images={post.images.map((image) => image.imageUrl)} />

      {/* 책 정보 */}
      <div className="px-page-x">
        <BookInfo
          book={post.book}
          className="border-primary border-l-2 bg-slate-50 p-2"
        />
      </div>
    </article>
  );
}
