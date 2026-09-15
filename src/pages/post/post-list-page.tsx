import PostListFAB from "@/components/post-list/post-list-floating-button";
import PostListIntro from "@/components/post-list/post-list-intro";
import PostCard from "@/components/post-card/post-card";
import { usePostListData } from "@/hooks/queries/use-post-list-data";
import GlobalLoading from "@/components/global-loading";
import GlobalError from "@/components/global-error";
import PublicNotFound from "@/components/Public-not-fount";
import { useParams } from "react-router";
import MainHeader from "@/components/header/main-header";

export default function PostListPage() {
  const { publicId } = useParams();
  const { data, isPending, isError } = usePostListData(publicId);

  if (isPending) return <GlobalLoading />;
  if (isError) return <GlobalError />;
  if (!data) return <PublicNotFound />;

  const { posts } = data;

  return (
    <main className="mx-auto min-h-dvh w-full max-w-2xl bg-gray-100">
      {/* 헤더 */}
      <MainHeader />

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
