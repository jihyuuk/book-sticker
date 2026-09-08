import type { BookSearchResult } from "@/api/book-api";
import { supabase } from "@/lib/supabse";

type CreatePostParam = {
  classroomId: string;
  kidId: string;
  book: BookSearchResult;
  content: string;
  password: string;
};

type CreatePostResponse = {
  postId: string;
};

export async function createPost(
  params: CreatePostParam,
): Promise<CreatePostResponse> {
  const { data, error } = await supabase.functions.invoke<CreatePostResponse>(
    "create-post",
    {
      body: params,
    },
  );

  if (error) throw error;
  if (!data) throw new Error("게시글 생성 응답이 없습니다.");

  return data;
}
