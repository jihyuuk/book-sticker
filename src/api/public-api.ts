import { supabase } from "@/lib/supabse";
import type {
  ChartData,
  PostCreateData,
  PostListData,
} from "@/types/data-types";

// ============================================================
// 차트
// ============================================================
export async function fetchChartData(
  publicId: string,
): Promise<ChartData | null> {
  const { data, error } = await supabase.rpc("get_public_chart_data", {
    p_public_id: publicId,
  });

  if (error) throw error;

  return data as unknown as ChartData | null;
}

// ============================================================
// 게시글 목록
// ============================================================
export async function fetchPostListData(
  publicId: string,
): Promise<PostListData | null> {
  const { data, error } = await supabase.functions.invoke<PostListData | null>(
    "fetch-public-posts",
    {
      body: {
        publicId,
      },
    },
  );

  if (error) throw error;

  return data;
}

// ============================================================
// 게시글 생성시 필요한 데이터
// ============================================================
export async function fetchPostCreateData(
  publicId: string,
): Promise<PostCreateData | null> {
  const { data, error } = await supabase.rpc("get_public_kids", {
    p_public_id: publicId,
  });

  if (error) throw error;

  return data as unknown as PostCreateData | null;
}
