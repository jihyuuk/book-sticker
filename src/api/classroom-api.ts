import { supabase } from "@/lib/supabse";
import type { Classroom } from "@/types/entity-types";
import { nanoid } from "nanoid";

// ============================================================
// 타입
// ============================================================

export type CreateClassroomParam = Pick<Classroom, "name" | "is_public">;

export type UpdateClassroomParam = {
  id: Classroom["id"];
} & Partial<Pick<Classroom, "name" | "is_public">>;

// ============================================================
// 조회
// ============================================================

// 반 단건 조회
export async function fetchClassroom2(classroomId: string) {
  const { data, error } = await supabase
    .from("classroom")
    .select("*")
    .eq("id", classroomId)
    .single();

  if (error) throw error;

  return data;
}

// 현재 로그인한 유치원 계정의 모든 classroom 조회
export async function fetchClassrooms() {
  const { data, error } = await supabase
    .from("classroom")
    .select("*")
    .order("name");

  if (error) throw error;

  return data;
}

// ============================================================
// 생성
// ============================================================

export async function createClassroom2(request: CreateClassroomParam) {
  const { data, error } = await supabase
    .from("classroom")
    .insert({
      ...request,
      public_id: nanoid(12),
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}

// ============================================================
// 수정
// ============================================================

export async function updateClassroom(
  request: UpdateClassroomParam,
): Promise<void> {
  const { id, ...updates } = request;

  const { error } = await supabase
    .from("classroom")
    .update(updates)
    .eq("id", id);

  if (error) throw error;
}

// ============================================================
// 삭제
// ============================================================

export async function deleteClassroom(id: Classroom["id"]): Promise<void> {
  const { error } = await supabase.functions.invoke("delete-classroom", {
    body: {
      classroomId: id,
    },
  });

  if (error) throw error;
}

export async function deleteClassroom2(classroomId: string) {
  const { error } = await supabase
    .from("classroom")
    .delete()
    .eq("id", classroomId)
    .select("id")
    .single();

  if (error) throw error;
}
