import { updateKid, fetchKidsByClassroom } from "@/api/kid-api";
import { ADMIN_QUERY_KEYS } from "@/lib/query-keys/admin-query-keys";
import { clearAdminPostsAndChart } from "@/lib/query-keys/remove-cache";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type UpdateKidMutationParam = Parameters<typeof updateKid>[0] & {
  classroomId: string;
};

export function useUpdateKid() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      kidId,
      name,
      bookCount,
      profileImage,
    }: UpdateKidMutationParam) =>
      updateKid({
        kidId,
        name,
        bookCount,
        profileImage,
      }),

    onSuccess: (updatedKid, variables) => {
      queryClient.setQueryData<
        Awaited<ReturnType<typeof fetchKidsByClassroom>>
      >(ADMIN_QUERY_KEYS.kids.byClassroom(variables.classroomId), (old) => {
        if (!old) return old;

        return old
          .map((kid) =>
            kid.id === updatedKid.id ? { ...kid, ...updatedKid } : kid,
          )
          .sort((a, b) => (a.name ?? "").localeCompare(b.name ?? "", "ko"));
      });

      // posts,chart 캐싱 지우기
      clearAdminPostsAndChart(queryClient);
    },
  });
}
