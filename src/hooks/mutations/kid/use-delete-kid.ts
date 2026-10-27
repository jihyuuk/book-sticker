import { deleteKid, fetchKidsByClassroom } from "@/api/kid-api";
import { ADMIN_QUERY_KEYS } from "@/lib/query-keys/admin-query-keys";
import { clearAdminPostsAndChart } from "@/lib/query-keys/remove-cache";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type DeleteKidMutationParam = {
  kidId: string;
  classroomId: string;
};

export function useDeleteKid() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ kidId }: DeleteKidMutationParam) => deleteKid(kidId),

    onSuccess: (_, variables) => {
      queryClient.setQueryData<
        Awaited<ReturnType<typeof fetchKidsByClassroom>>
      >(ADMIN_QUERY_KEYS.kids.byClassroom(variables.classroomId), (old) => {
        if (!old) return old;

        return old.filter((kid) => kid.id !== variables.kidId);
      });

      // posts,chart 캐싱 지우기
      clearAdminPostsAndChart(queryClient);
    },
  });
}
