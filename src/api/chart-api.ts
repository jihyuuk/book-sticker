import { supabase } from "@/lib/supabse";
import type { ChartData } from "@/types/data-types";

export async function fetchChartData(
  publicId: string,
): Promise<ChartData | null> {
  const { data, error } = await supabase.rpc("get_public_chart_data", {
    p_public_id: publicId,
  });

  if (error) throw error;

  //리팩토링 - zod 도입 고려
  return data as unknown as ChartData | null;
}
