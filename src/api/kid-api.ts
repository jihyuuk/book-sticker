import { supabase } from "@/lib/supabse";
import type { Kid } from "@/types/entity-types";

export type CreateKidParam = Pick<Kid, "classroom_id" | "name" | "book_count">;
export type UpdateKidParam = Pick<Kid, "id" | "name" | "book_count">;

//모든 아이 조회
export async function fetchKids(classroom_id: string) {
  const { data, error } = await supabase
    .from("kid")
    .select("*")
    .eq("classroom_id", classroom_id)
    .order("name");

  if (error) throw error;

  return data;
}

// 생성
export async function createKid(request: CreateKidParam) {
  const { data, error } = await supabase
    .from("kid")
    .insert(request)
    .select()
    .single();

  if (error) throw error;

  return data;
}

//수정
export async function updateKid(request: UpdateKidParam): Promise<void> {
  const { id, ...updates } = request;

  const { error } = await supabase.from("kid").update(updates).eq("id", id);

  if (error) throw error;
}

//삭제
// 리팩토링 - 게시글 이미지, 프로필 이미지 Storage 정리를 위해 Edge Function으로 전환
export async function deleteKidById(id: Kid["id"]): Promise<void> {
  const { error } = await supabase.from("kid").delete().eq("id", id);

  if (error) throw error;
}
