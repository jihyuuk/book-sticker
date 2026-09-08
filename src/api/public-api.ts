import { supabase } from "@/lib/supabse";
import type {
  PublicChartData,
  PublicKidListData,
  PublicPostDetailData,
  PublicPostListData,
} from "@/public-types";

// ============================================================
// 차트
// ============================================================
export async function fetchPublicChartData(
  publicId: string,
): Promise<PublicChartData | null> {
  const { data, error } = await supabase.rpc("get_public_chart_data", {
    p_public_id: publicId,
  });

  if (error) throw error;

  return data as unknown as PublicChartData | null;
}

// ============================================================
// 아이 목록
// ============================================================
export async function fetchPublicKids(
  publicId: string,
): Promise<PublicKidListData | null> {
  const { data, error } = await supabase.rpc("get_public_kids", {
    p_public_id: publicId,
  });

  if (error) throw error;

  return data as unknown as PublicKidListData | null;
}

// ============================================================
// 게시글 목록
// ============================================================
export async function fetchPublicPosts(
  publicId: string,
): Promise<PublicPostListData | null> {
  const { data, error } = await supabase.rpc("get_public_posts", {
    p_public_id: publicId,
  });

  if (error) throw error;

  return data as unknown as PublicPostListData | null;
}

// ============================================================
// 게시글 상세
// ============================================================
type FetchPublicPostDetailParam = {
  publicId: string;
  postId: string;
};

export async function fetchPublicPostDetail({
  publicId,
  postId,
}: FetchPublicPostDetailParam): Promise<PublicPostDetailData | null> {
  const { data, error } = await supabase.rpc("get_public_post_detail", {
    p_public_id: publicId,
    p_post_id: postId,
  });

  if (error) throw error;

  return data as unknown as PublicPostDetailData | null;
}
