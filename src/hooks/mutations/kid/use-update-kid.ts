import { updateKid, type UpdateKidParam } from "@/api/kid-api";
import { QUERY_KEYS } from "@/lib/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type UpdateKidMutationParam = UpdateKidParam & {
  classroomId: string;
};

export function useUpdateKid() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, name, book_count }: UpdateKidMutationParam) =>
      updateKid({
        id,
        name,
        book_count,
      }),

    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.settingClassroom(variables.classroomId),
      });
    },
  });
}
