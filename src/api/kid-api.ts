import { supabase } from "@/lib/supabse";

type CreateKidParams = {
  classroomId: string;
  name: string;
  bookCount: number;
};

type UpdateKidParams = {
  kidId: string;
  name: string;
  bookCount: number;
};

//반의 모든 원아 조회
export async function fetchKidsByClassroomId(classroom_id: string) {
  const { data, error } = await supabase
    .from("kid")
    .select("*")
    .eq("classroom_id", classroom_id)
    .order("name");

  if (error) throw error;

  return data;
}

// 원아 생성
export async function createKid({
  classroomId,
  name,
  bookCount,
}: CreateKidParams) {
  const { data, error } = await supabase
    .from("kid")
    .insert({
      classroom_id: classroomId,
      name: name.trim(),
      book_count: bookCount,
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}

// 원아 수정
export async function updateKid({ kidId, name, bookCount }: UpdateKidParams) {
  const { data, error } = await supabase
    .from("kid")
    .update({
      name: name.trim(),
      book_count: bookCount,
    })
    .eq("id", kidId)
    .select()
    .single();

  if (error) throw error;

  return data;
}

// 원아 삭제
export async function deleteKid(kidId: string) {
  const { error } = await supabase
    .from("kid")
    .delete()
    .eq("id", kidId)
    .select("id")
    .single();

  if (error) throw error;
}
