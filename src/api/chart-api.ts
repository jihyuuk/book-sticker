import { supabase } from "@/lib/supabse";

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

// 공개 차트 조회
export async function fetchPublicChart(
  publicId: string,
): Promise<ChartResponse> {
  const { data, error } = await supabase.functions.invoke<ChartResponse>(
    "fetch-public-chart",
    {
      body: { publicId },
    },
  );

  if (error) throw error;

  if (!data) {
    throw new Error("차트 데이터를 불러오지 못했습니다.");
  }

  return data;
}
