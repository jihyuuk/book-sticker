import { updateAccountSetting, type SettingData } from "@/api/setting-api";
import { QUERY_KEYS } from "@/lib/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateSetting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAccountSetting,

    onSuccess: (_, variables) => {
      queryClient.setQueryData<SettingData>(QUERY_KEYS.setting, (old) => {
        if (!old) return old;

        return {
          ...old,
          ...variables,
        };
      });
    },
  });
}
