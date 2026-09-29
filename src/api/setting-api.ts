import { supabase } from "@/lib/supabse";
import type { AccountSetting, Classroom } from "@/types/entity-types";

export type SettingData = {
  name: string;
  daily_book_limit: number;
  classrooms: Pick<Classroom, "id" | "name">[];
};

export type UpdateAccountSettingParam = Partial<
  Pick<AccountSetting, "name" | "daily_book_limit">
>;

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
