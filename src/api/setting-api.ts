import { supabase } from "@/lib/supabse";
import type { AccountSetting } from "@/types/entity-types";

export type UpdateAccountSettingParam = Partial<
  Pick<AccountSetting, "name" | "daily_book_limit">
>;

//account_setting 컬럼 불러오기
export async function fetchAccountSetting() {
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
    data: { session },
    error: authError,
  } = await supabase.auth.getSession();

  if (authError || !session) {
    throw new Error("로그인이 필요합니다.");
  }

  const { error } = await supabase
    .from("account_setting")
    .update(request)
    .eq("user_id", session.user.id)
    .select("user_id")
    .single();

  if (error) throw error;
}
