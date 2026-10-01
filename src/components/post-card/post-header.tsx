import type { PublicPost } from "@/types/public-types";
import { formatRelativeTime } from "@/lib/utils";
import PostDropdownMenu from "./post-dropdown-menu";
import PostDropdownAdminMenu from "./post-dropdown-admin-menu";

type Props = {
  post: PublicPost;
  classroomName?: string | null;
  isAdmin?: boolean;
};

export default function PostHeader({ post, classroomName, isAdmin }: Props) {
  const kid = post.kid;

  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex min-w-0 items-center gap-3">
        {/* 프로필 이미지 */}
        <div className="size-10 shrink-0 overflow-hidden rounded-full bg-sky-100">
          {kid.profile_image_url ? (
            <img
              src={kid.profile_image_url}
              alt={`${kid.name} 프로필`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-sky-600">
              {post.kid.name.slice(0, 1)}
            </div>
          )}
        </div>

        {/* 이름 / 작성 시간 */}
        <div className="min-w-0">
          <p className="truncate text-base font-semibold text-gray-900">
            {post.kid.name}
          </p>

          <p className="text-xs text-gray-400">
            {classroomName && (
              <>
                <span className="text-gray-500">{classroomName}</span>
                <span className="mx-1">·</span>
              </>
            )}

            {formatRelativeTime(post.created_at)}
          </p>
        </div>
      </div>

      {isAdmin ? (
        <PostDropdownAdminMenu post={post} />
      ) : (
        <PostDropdownMenu post={post} />
      )}
    </div>
  );
}
