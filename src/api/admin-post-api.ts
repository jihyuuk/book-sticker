import { supabase } from "@/lib/supabse";
import type { Classroom } from "@/types/entity-types";
import type { PublicPost } from "@/types/public-types";

export type AdminPost = PublicPost & {
  classroom: Pick<Classroom, "id" | "name">;
};

export async function fetchAdminPosts(
  classroomId: string | null,
): Promise<AdminPost[]> {
  const { data, error } = await supabase.functions.invoke("fetch-admin-posts", {
    body: {
      classroomId,
    },
  });

  if (error) throw error;

  return data;
}

export async function deletePostByAdmin(postId: string): Promise<void> {
  const { error } = await supabase.functions.invoke("delete-post-by-admin", {
    body: {
      postId,
    },
  });

  if (error) throw error;
}
