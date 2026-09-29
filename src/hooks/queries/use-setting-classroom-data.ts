import { fetchSettingClassroomData } from "@/api/setting-api";
import { QUERY_KEYS } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";

export function useSettingClassroomData(classroomId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.settingClassroom(classroomId),
    queryFn: () => fetchSettingClassroomData(classroomId),
    enabled: !!classroomId,
  });
}
