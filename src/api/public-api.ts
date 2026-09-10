import { supabase } from "@/lib/supabse";
import type {
  PublicChartData,
  PublicKidListData,
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
