import { supabase } from "@/lib/supabse";
import type { SearchPublicPostsPageData } from "@/types/dto/public-dto";

export type PublicSearchSort = "latest" | "oldest";

export type SearchPublicPostsParams = {
  publicId: string;
  keyword: string;
  sort?: PublicSearchSort;
  cursor?: string | null;
};

// 퍼블릭 게시글 통합 검색
export async function searchPublicPosts({
  publicId,
  keyword,
  sort = "latest",
  cursor = null,
}: SearchPublicPostsParams): Promise<SearchPublicPostsPageData> {
  const { data, error } =
    await supabase.functions.invoke<SearchPublicPostsPageData>(
      "search-public-posts",
      {
        body: {
          publicId,
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
