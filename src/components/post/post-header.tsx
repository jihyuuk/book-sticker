import type { TempProps } from "./post-card";
import PostDropdownMenu from "./post-dropdwon-menu";

export default function PostHeader({ post }: TempProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex min-w-0 items-center gap-3">
        {/* 프로필 이미지 */}
        <div className="size-10 shrink-0 overflow-hidden rounded-full bg-sky-100">
          {post.profileImage ? (
            <img
              src={post.profileImage}
              alt={`${post.kidName} 프로필`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-sky-600">
              {post.kidName.slice(0, 1)}
            </div>
          )}
        </div>

        {/* 이름 / 작성 시간 */}
        <div className="min-w-0">
          <p className="truncate text-base font-semibold text-gray-900">
            {post.kidName}
          </p>

          <p className="text-xs text-gray-400">{post.createdAt}</p>
        </div>
      </div>

      <PostDropdownMenu publicId="test" postId={post.id} />
    </div>
  );
}
