import { posts } from "./mock-post";
import PostListHeader from "@/components/post-list/post-list-header";
import PostListIntro from "@/components/post-list/post-list-intro";
import PostCard from "@/components/post/post-card";

export default function ListTestPage() {
  return (
    <main className="mx-auto min-h-dvh w-full max-w-2xl bg-gray-100">
      {/* 헤더 */}
      <PostListHeader />

      {/* 선생님이 작성한 타이틀 */}
      <PostListIntro />

      {/* 카드 리스트 */}
      <div className="space-y-8">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </main>
  );
}
