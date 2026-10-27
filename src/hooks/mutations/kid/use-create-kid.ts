import { createKid, fetchKidsByClassroom } from "@/api/kid-api";
import { ADMIN_QUERY_KEYS } from "@/lib/query-keys/admin-query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateKid() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createKid,

    onSuccess: (createdKid, variables) => {
      queryClient.setQueryData<
        Awaited<ReturnType<typeof fetchKidsByClassroom>>
      >(ADMIN_QUERY_KEYS.kids.byClassroom(variables.classroomId), (old) => {
        if (!old) return old;

        return [
          ...old,
          {
            ...createdKid,
            post_count: 0,
          },
        ].sort((a, b) => a.name.localeCompare(b.name, "ko"));
      });
    },
  });
}
