import { supabase } from "@/lib/supabse";
import type { Kid, KidInsert, KidUpdate } from "@/types";

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
export async function createKid(request: KidInsert) {
  const { data, error } = await supabase
    .from("kid")
    .insert(request)
    .select()
    .single();

  if (error) throw error;

  return data;
}

//수정
export async function updateKid(
  request: Pick<Kid, "id"> & KidUpdate,
): Promise<void> {
  const { id, ...updates } = request;

  const { error } = await supabase.from("kid").update(updates).eq("id", id);

  if (error) throw error;
}

//삭제
export async function deleteKidById(id: Kid["id"]): Promise<void> {
  const { error } = await supabase.from("kid").delete().eq("id", id);

  if (error) throw error;
}
