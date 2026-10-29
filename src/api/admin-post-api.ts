import { supabase } from "@/lib/supabse";
import type { PublicPost } from "@/types/dto/public-dto";
import type { Classroom } from "@/types/entity-types";

export type AdminPost = PublicPost & {
  classroom: Pick<Classroom, "id" | "name">;
};

type FetchAdminPostsParams = {
  classroomId: string | null;
  cursor: string | null;
};

type fetchAdminPostsResponse = {
  posts: AdminPost[];
  nextCursor: string | null;
};

//어드민 - 게시글 조회
export async function fetchAdminPosts({
  classroomId,
  cursor,
}: FetchAdminPostsParams): Promise<fetchAdminPostsResponse> {
  const { data, error } =
    await supabase.functions.invoke<fetchAdminPostsResponse>(
      "fetch-admin-posts",
      {
        body: {
          classroomId,
          cursor,
        },
      },
    );

  if (error) throw error;

  if (!data) {
    throw new Error("게시글 데이터를 불러오지 못했습니다.");
  }

  return data;
}

//어드민 - 게시글 삭제
export async function deletePostAsAdmin(postId: string): Promise<void> {
  const { error } = await supabase.functions.invoke("delete-post-by-admin", {
    body: {
      postId,
    },
  });

  if (error) throw error;
}
