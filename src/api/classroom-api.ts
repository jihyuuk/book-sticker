import { supabase } from "@/lib/supabse";
import { nanoid } from "nanoid";

// 레거시=========================================================
// 현재 로그인한 사용자의 classroom 조회
export async function fetchClassroom(userId: string) {
  const { data, error } = await supabase
    .from("classroom")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;

  return data;
}

// classroom 생성
export async function createClassroom() {
  const { data, error } = await supabase
    .from("classroom")
    .insert({
      public_id: nanoid(12),
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}
//===============================================================

//fetchClassrooms: .from() 현재 로그인한 유치원 계정이 소유한 classroom 전체 조회
//createClassroom: .from() 사용자가 명시적으로 새 반 추가
//updateClassroom: .from() 반 이름, 공개 여부 등 classroom 정보 수정
//deleteClassroom: Edge 반 삭제 + 관련 DB 데이터 및 Storage 이미지 정리
