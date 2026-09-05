import { supabase } from "@/lib/supabse";
import { nanoid } from "nanoid";

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
