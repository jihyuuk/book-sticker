import { createClassroom, fetchClassroom } from "@/api/classroom-api";
import { QUERY_KEYS } from "@/lib/query-keys";
import { useSession } from "@/store/session";
import { useQuery } from "@tanstack/react-query";

export function useClassroom() {
  const session = useSession();
  const userId = session?.user.id;

  return useQuery({
    queryKey: QUERY_KEYS.classroom.byUserId(userId!),

    queryFn: async () => {
      const classroom = await fetchClassroom(userId!);

      if (!classroom) {
        return await createClassroom();
      }

      return classroom;
    },

    enabled: !!userId,
  });
}
