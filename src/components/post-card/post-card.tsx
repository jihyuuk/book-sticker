import PostHeader from "./post-header";
import BookInfo from "../book/book-info";
import PostCaption from "./post-caption";
import type { PublicPost } from "@/types/dto/public-dto";
import { memo } from "react";
import PostMediaCarousel from "./post-media-carousel";

type Props = {
  post: PublicPost;
  //리팩토링- classroom name = not null
  classroomName?: string | null;
  isAdmin?: boolean;
  highlightKeyword?: string;
};

function PostCard({ post, classroomName, isAdmin, highlightKeyword }: Props) {
  return (
    <article className="bg-white">
      {/* 헤더 */}
      <PostHeader
        post={post}
        classroomName={classroomName}
        isAdmin={isAdmin}
        highlightKeyword={highlightKeyword}
      />

      {/* 독서록 */}
      <PostCaption caption={post.content} highlightKeyword={highlightKeyword} />

      {/* 피드 이미지 */}
      <PostMediaCarousel media={post.media} />
      {/* <PostImageCarousel images={post.images.map((image) => image.imageUrl)} /> */}

      {/* 책 정보 */}
      <div className="px-page-x">
        <BookInfo
          book={post.book}
          highlightKeyword={highlightKeyword}
          className="border-primary border-l-2 bg-slate-50 p-2"
        />
      </div>
    </article>
  );
}

export default memo(PostCard);
