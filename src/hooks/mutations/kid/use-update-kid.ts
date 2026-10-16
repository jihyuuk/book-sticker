import { updateKid } from "@/api/kid-api";
import { QUERY_KEYS } from "@/lib/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type UpdateKidMutationParam = Parameters<typeof updateKid>[0] & {
  classroomId: string;
};

export function useUpdateKid() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ kidId, name, bookCount }: UpdateKidMutationParam) =>
      updateKid({
        kidId,
        name,
        bookCount,
      }),

    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.kid.list2(variables.classroomId),
      });
    },
  });
}
