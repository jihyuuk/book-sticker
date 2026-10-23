import { getKidProfileUrl } from "@/lib/storage";
import { supabase } from "@/lib/supabse";
import type { PublicClassroom, PublicKid } from "@/types/dto/public-dto";

// 최신 코드
export type ChartKid = {
  id: string;
  name: string;
  book_count: number;
  post_count: number;
  total_count: number;
};

export type ChartResponse = {
  classroom: {
    id: string;
    name: string;
  };
  kids: ChartKid[];
};

// 관리자 차트 조회
export async function fetchAdminChart(
  classroomId: string,
): Promise<ChartResponse> {
  const [classroomResult, kidsResult] = await Promise.all([
    supabase
      .from("classroom")
      .select("id, name")
      .eq("id", classroomId)
      .single(),

    supabase
      .from("kid")
      .select(
        `
        id,
        name,
        book_count,
        post(count)
      `,
      )
      .eq("classroom_id", classroomId)
      .order("name", { ascending: true }),
  ]);

  if (classroomResult.error) throw classroomResult.error;
  if (kidsResult.error) throw kidsResult.error;

  const kids = (kidsResult.data ?? []).map((kid) => {
    const bookCount = kid.book_count ?? 0;
    const postCount = kid.post?.[0]?.count ?? 0;

    return {
      id: kid.id,
      name: kid.name,
      book_count: bookCount,
      post_count: postCount,
      total_count: bookCount + postCount,
    };
  });

  return {
    classroom: {
      id: classroomResult.data.id,
      name: classroomResult.data.name ?? "",
    },
    kids,
  };
}

//========================================================================
//Public Chart - 통과
//========================================================================
// 공개 차트 응답 - 통과
export type PublicChartResponse = {
  classroom: PublicClassroom;
  chart: {
    kid: PublicKid;
    postCount: number;
    totalCount: number;
  }[];
};

// 공개 차트 조회 - 통과
export async function fetchPublicChart(
  publicId: string,
): Promise<PublicChartResponse> {
  const { data, error } = await supabase.rpc("get_public_chart", {
    p_public_id: publicId,
  });

  if (error) throw error;

  if (!data) {
    throw new Error("차트 데이터를 불러오지 못했습니다.");
  }

  const response = data as unknown as PublicChartResponse;

  //그냥 반환 못해요 ㅜㅜ kid의 profileImage가 path라 url로 변환해줘야해요 ㅜㅜ
  return {
    ...response,
    chart: response.chart.map((item) => ({
      ...item,
      kid: {
        ...item.kid,
        profileImageUrl: getKidProfileUrl(item.kid.profileImageUrl),
      },
    })),
  };
}
