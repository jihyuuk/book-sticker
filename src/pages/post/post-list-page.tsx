import PostListFAB from "@/components/post-list/post-list-floating-button";
import PostListHeader from "@/components/post-list/header/post-list-header";
import PostListIntro from "@/components/post-list/post-list-intro";
import PostCard from "@/components/post/post-card";
import { usePublicPosts } from "@/hooks/queries/use-public-posts";
import GlobalLoading from "@/components/global-loading";
import GlobalError from "@/components/global-error";
import PublicNotFound from "@/components/Public-not-fount";
import { useParams } from "react-router";

export default function PostListPage() {
  const { publicId } = useParams();
  const { data, isPending, isError } = usePublicPosts(publicId);

  if (isPending) return <GlobalLoading />;
  if (isError) return <GlobalError />;
  if (!data) return <PublicNotFound />;

  const { posts } = data;

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

      {/* 플로팅 버튼 */}
      <PostListFAB />
    </main>
  );
}
