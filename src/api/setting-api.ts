import { supabase } from "@/lib/supabse";
import type { AccountSetting, Classroom, Kid } from "@/types/entity-types";

export type SettingData = {
  name: string;
  daily_book_limit: number;
  classrooms: Pick<Classroom, "id" | "name">[];
};

export type UpdateAccountSettingParam = Partial<
  Pick<AccountSetting, "name" | "daily_book_limit">
>;

export type ClassroomData = {
  classroom: Classroom;
  kids: Kid[];
};

export type UpdateClassroomParam = {
  id: Classroom["id"];
} & Partial<Pick<Classroom, "name" | "is_public">>;

export async function fetchSettingData(): Promise<SettingData> {
  const [settingResult, classroomResult] = await Promise.all([
    supabase.from("account_setting").select("name, daily_book_limit").single(),

    supabase.from("classroom").select("id, name").order("name"),
  ]);

  if (settingResult.error) throw settingResult.error;
  if (classroomResult.error) throw classroomResult.error;

  return {
    name: settingResult.data.name,
    daily_book_limit: settingResult.data.daily_book_limit,
    classrooms: classroomResult.data,
  };
}

export async function updateAccountSetting(
  request: UpdateAccountSettingParam,
): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("로그인이 필요합니다.");

  const { error } = await supabase
    .from("account_setting")
    .update(request)
    .eq("user_id", user.id);

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
