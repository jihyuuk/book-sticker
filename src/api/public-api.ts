import { supabase } from "@/lib/supabse";
import type { PublicChartData } from "@/types";

export async function fetchPublicChartData(
  publicId: string,
): Promise<PublicChartData | null> {
  const { data, error } = await supabase.rpc("get_public_classroom", {
    p_public_id: publicId,
  });

  if (error) throw error;

  return data as PublicChartData | null;
}
