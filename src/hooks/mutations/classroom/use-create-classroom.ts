import { createClassroom, fetchClassrooms } from "@/api/classroom-api";
import { ADMIN_QUERY_KEYS } from "@/lib/query-keys/admin-query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateClassroom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createClassroom,

    onSuccess: (createdClassroom) => {
      queryClient.setQueryData(
        ADMIN_QUERY_KEYS.classrooms.list,
        (old: Awaited<ReturnType<typeof fetchClassrooms>> | undefined) => {
          if (!old) return old;

          //리팩토링 - not null name이
          return [...old, createdClassroom].sort((a, b) =>
            (a.name ?? "").localeCompare(b.name ?? "", "ko"),
          );
        },
      );
    },
  });
}
