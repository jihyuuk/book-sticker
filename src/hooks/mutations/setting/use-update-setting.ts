import { fetchSettingData, updateAccountSetting } from "@/api/setting-api";
import { QUERY_KEYS } from "@/lib/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateSetting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAccountSetting,

    onSuccess: (_, variables) => {
      queryClient.setQueryData<Awaited<ReturnType<typeof fetchSettingData>>>(
        QUERY_KEYS.setting,
        (old) => {
          if (!old) return old;

          return {
            ...old,
            ...variables,
          };
        },
      );
    },
  });
}
