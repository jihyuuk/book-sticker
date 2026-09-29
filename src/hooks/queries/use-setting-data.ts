import { fetchSettingData } from "@/api/setting-api";
import { QUERY_KEYS } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";

export function useSettingData() {
  return useQuery({
    queryKey: QUERY_KEYS.setting,
    queryFn: fetchSettingData,
  });
}
