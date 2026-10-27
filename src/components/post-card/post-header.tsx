import { formatRelativeTime } from "@/lib/utils";
import PostDropdownMenu from "./post-dropdown-menu";
import PostDropdownAdminMenu from "./post-dropdown-admin-menu";
import type { PublicPost } from "@/types/dto/public-dto";
import { useMemo, useState } from "react";

type Props = {
  post: PublicPost;
  //리팩토링-null 제거
  classroomName?: string | null;
  isAdmin?: boolean;
};

export default function PostHeader({ post, classroomName, isAdmin }: Props) {
  const kid = post.kid;

  const [showAbsoluteTime, setShowAbsoluteTime] = useState(false);

  // n 분전
  const relativeTime = useMemo(
    () => formatRelativeTime(post.createdAt),
    [post.createdAt],
  );

  // 2026-10-05 00:00:00
  const absoluteTime = useMemo(
    () =>
      new Date(post.createdAt).toLocaleString("sv-SE", {
        timeZone: "Asia/Seoul",
        hour12: false,
      }),
    [post.createdAt],
  );

  return (
    <div className="px-page-x flex items-center justify-between">
      <div className="flex min-w-0 items-center gap-3">
        {/* 프로필 이미지 */}
        <div className="size-10 shrink-0 overflow-hidden rounded-full bg-sky-100">
          {kid.profileImageUrl ? (
            <img
              src={kid.profileImageUrl}
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

          <p className="flex gap-1 truncate text-xs text-gray-400">
            {classroomName && (
              <>
                <span className="text-gray-500">{classroomName}</span>
                <span className="">·</span>
              </>
            )}
            <button
              type="button"
              onClick={() => setShowAbsoluteTime((prev) => !prev)}
            >
              {showAbsoluteTime ? absoluteTime : relativeTime}
            </button>

            {post.createdAt !== post.updatedAt && (
              <span className="">(수정됨)</span>
            )}
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
