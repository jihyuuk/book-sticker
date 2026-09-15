import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { toast } from "sonner";

import SubHeader from "@/components/header/sub-header";
import type { PublicPost } from "@/types/public-types";
import PostEditForm from "@/components/post-form/post-edit-form";

export type PostEditState = {
  post: PublicPost;
  password: string;
};

export default function PostEditPage() {
  const { publicId, postId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as PostEditState | null;

  const post = state?.post;
  const password = state?.password;

  const isValidState = !!post && !!password && post.id === postId;

  useEffect(() => {
    if (isValidState) return;

    toast.error("수정 정보를 확인할 수 없습니다. 다시 시도해주세요.");

    if (publicId) {
      navigate(`/classroom/${publicId}/posts`, {
        replace: true,
      });
    }
  }, [isValidState, publicId, navigate]);

  if (!isValidState || !post || !password) {
    return null;
  }

  return (
    <main className="min-h-dvh bg-white">
      <div className="mx-auto w-full max-w-2xl pb-10">
        {/* 헤더 */}
        <SubHeader title="독후감 수정" />

        {/* 수정 폼 */}
        <PostEditForm post={post} password={password} />
      </div>
    </main>
  );
}
