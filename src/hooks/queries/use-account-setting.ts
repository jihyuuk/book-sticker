import { fetchAccountSetting } from "@/api/setting-api";
import { ADMIN_QUERY_KEYS } from "@/lib/query-keys/admin-query-keys";
import { useQuery } from "@tanstack/react-query";

export function useAccountSetting() {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.settings.account,
    queryFn: fetchAccountSetting,
  });
}
