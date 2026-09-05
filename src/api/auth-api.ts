import { supabase } from "@/lib/supabse";
import type { AuthParam } from "@/types";

export async function singUp({ email, password }: AuthParam) {
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) throw error;

  return data;
}

export async function signIn({ email, password }: AuthParam) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) throw error;
}
