import type { QueryClient } from "@tanstack/react-query";
import { ADMIN_QUERY_KEYS } from "./admin-query-keys";

// 어드민 - 원아, 반 - 수정,삭제시 캐시 초기화
export function clearAdminPostsAndChart(queryClient: QueryClient) {
  queryClient.removeQueries({
    queryKey: ADMIN_QUERY_KEYS.posts.all,
  });

  queryClient.removeQueries({
    queryKey: ADMIN_QUERY_KEYS.charts.all,
  });
}
