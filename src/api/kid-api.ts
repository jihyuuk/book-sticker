import { supabase } from "@/lib/supabse";
import type { Kid } from "@/types";

//모든 아이 조회
export async function fetchKids(classroomId: string) {
  const { data, error } = await supabase
    .from("kid")
    .select("*")
    .eq("classroom_id", classroomId)
    .order("name");

  if (error) throw error;

  return data.map((kid) => ({
    id: kid.id,
    name: kid.name,
    classroomid: kid.classroom_id,
    bookCount: kid.book_count,
  }));
}

// 생성
export async function createKid(request: Omit<Kid, "id">) {
  const { data, error } = await supabase
    .from("kid")
    .insert({
      classroom_id: request.classroomId,
      name: request.name,
      book_count: request.bookCount,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

//수정
export async function updateKid(
  request: Partial<Kid> & Pick<Kid, "id">,
): Promise<void> {
  const { id, name, bookCount } = request;

  const updates: {
    name?: string;
    book_count?: number;
  } = {};

  if (name !== undefined) {
    updates.name = name;
  }

  if (bookCount !== undefined) {
    updates.book_count = bookCount;
  }

  const { error } = await supabase.from("kid").update(updates).eq("id", id);

  if (error) throw error;
}

//삭제
export async function deleteKidById(id: Kid["id"]): Promise<void> {
  const { error } = await supabase.from("kid").delete().eq("id", id);

  if (error) throw error;
}
