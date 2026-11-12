import PostHeader from "./post-header";
import BookInfo from "../book/book-info";
import PostCaption from "./post-caption";
import type { PublicPost } from "@/types/dto/public-dto";
import { memo } from "react";
import PostMediaCarousel, { type PostMedia } from "./post-media-carousel";

const post: PublicPost = {
  id: "028c4868-d8ae-44d9-8a96-3888bd3add6a",
  content: "123ㅇㅇㅇㅇ",
  createdAt: "2026-11-10T03:59:35.66552+00:00",
  updatedAt: "2026-11-10T04:13:42.628463+00:00",
  kid: {
    id: "c716424f-ba89-48a8-931d-02975ec9073b",
    name: "강하준",
    profileImageUrl: null,
  },
  book: {
    id: "bc2876c5-b5b2-42c7-b32d-d65d3d1257e4",
    title: "123123",
    author: "123123",
    publisher: null,
    isbn: null,
    coverUrl: null,
  },
  images: [
    {
      id: "mock-1",
      imageUrl: "https://picsum.photos/seed/mock-1/800/600",
    },
    {
      id: "mock-2",
      imageUrl: "https://picsum.photos/seed/mock-2/600/800",
    },
    {
      id: "mock-3",
      imageUrl: "https://picsum.photos/seed/mock-3/700/700",
    },
    {
      id: "mock-4",
      imageUrl: "https://picsum.photos/seed/mock-4/960/540",
    },
    {
      id: "mock-5",
      imageUrl: "https://picsum.photos/seed/mock-5/600/1000",
    },
  ],
};

const media: PostMedia[] = [
  ...post.images.slice(0, 2).map((image) => ({
    id: image.id,
    type: "IMAGE" as const,
    url: image.imageUrl,
  })),
  {
    id: "test-video-1",
    type: "VIDEO",
    url: "https://mhreedutmgzfclmhnkmp.supabase.co/storage/v1/object/public/test-videos/1000043810.mp4",
  },
  ...post.images.slice(2, 4).map((image) => ({
    id: image.id,
    type: "IMAGE" as const,
    url: image.imageUrl,
  })),
];

function PostVideoCard() {
  return (
    <article className="bg-white">
      {/* 헤더 */}
      <PostHeader post={post} classroomName={null} isAdmin={false} />

      {/* 독서록 */}
      <PostCaption caption={post.content} />

      {/* 피드 이미지 */}
      <PostMediaCarousel media={media} />

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

export default memo(PostVideoCard);
