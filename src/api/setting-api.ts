import { supabase } from "@/lib/supabse";
import type { AccountSetting, Classroom, Kid } from "@/types/entity-types";

export type ClassroomData = {
  classroom: Classroom;
  kids: Kid[];
};

export type UpdateClassroomParam = {
  id: Classroom["id"];
} & Partial<Pick<Classroom, "name" | "is_public">>;

export type UpdateAccountSettingParam = Partial<
  Pick<AccountSetting, "name" | "daily_book_limit">
>;

//account_setting 컬럼 불러오기
export async function fetchSettingData() {
  const { data, error } = await supabase
    .from("account_setting")
    .select("name, daily_book_limit")
    .single();

  if (error) throw error;

  return data;
}

//account_setting 업데이트 - 모든 컬럼 공용
export async function updateAccountSetting(
  request: UpdateAccountSettingParam,
): Promise<void> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("로그인이 필요합니다.");
  }

  const { error } = await supabase
    .from("account_setting")
    .update(request)
    .eq("user_id", user.id)
    .select("user_id")
    .single();

  if (error) throw error;
}

export async function fetchSettingClassroomData(
  classroomId: string,
): Promise<ClassroomData> {
  const [classroomResult, kidsResult] = await Promise.all([
    supabase.from("classroom").select("*").eq("id", classroomId).single(),

    supabase
      .from("kid")
      .select("*")
      .eq("classroom_id", classroomId)
      .order("name"),
  ]);

  if (classroomResult.error) throw classroomResult.error;
  if (kidsResult.error) throw kidsResult.error;

  return {
    classroom: classroomResult.data,
    kids: kidsResult.data,
  };
}

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
