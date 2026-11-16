import { supabase } from "@/lib/supabse";
import type { AdminPost } from "@/api/admin-post-api";

export type AdminSearchSort = "latest" | "oldest";

export type SearchAdminPostsParams = {
  classroomId: string | null;
  keyword: string;
  sort?: AdminSearchSort;
  cursor?: string | null;
};

export type AdminSearchPostsPageData = {
  posts: AdminPost[];
  nextCursor: string | null;
  totalCount: number | null;
};

// 어드민 - 게시글 통합 검색
export async function searchAdminPosts({
  classroomId,
  keyword,
  sort = "latest",
  cursor = null,
}: SearchAdminPostsParams): Promise<AdminSearchPostsPageData> {
  const { data, error } =
    await supabase.functions.invoke<AdminSearchPostsPageData>(
      "search-admin-posts",
      {
        body: {
          classroomId,
          keyword,
          sort,
          cursor,
        },
      },
    );

  if (error) throw error;

  if (!data) {
    throw new Error("검색 결과를 불러오지 못했습니다.");
  }

  return data;
}
