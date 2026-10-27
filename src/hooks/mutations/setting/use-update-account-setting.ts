import { fetchAccountSetting, updateAccountSetting } from "@/api/setting-api";
import { ADMIN_QUERY_KEYS } from "@/lib/query-keys/admin-query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateAccountSetting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAccountSetting,

    onSuccess: (_, variables) => {
      queryClient.setQueryData<Awaited<ReturnType<typeof fetchAccountSetting>>>(
        ADMIN_QUERY_KEYS.settings.account,
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
