import { supabase } from "./supabse";

export function getKidProfileUrl(path: string | null): string | null {
  if (!path) return null;

  return supabase.storage.from("kid-profiles").getPublicUrl(path).data
    .publicUrl;
}
