import type { BookInfoData } from "@/components/book/book-info";
import { supabase } from "@/lib/supabse";

export type CreatePostParam = {
  publicId: string;
  kidId: string;
  book: BookInfoData;
  content: string;
  password: string;
  images: File[];
};

type CreatePostResponse = {
  postId: string;
};

export async function createPost(
  params: CreatePostParam,
): Promise<CreatePostResponse> {
  const { publicId, kidId, book, content, password, images } = params;

  const formData = new FormData();

  formData.append(
    "payload",
    JSON.stringify({
      publicId,
      kidId,
      book,
      content,
      password,
    }),
  );

  images.forEach((image) => {
    formData.append("images", image);
  });

  const { data, error } = await supabase.functions.invoke<CreatePostResponse>(
    "create-post",
    {
      body: formData,
    },
  );

  if (error) throw error;
  if (!data) throw new Error("게시글 생성 응답이 없습니다.");

  return data;
}

type VerifyPostPasswordParam = {
  postId: string;
  password: string;
};

export async function verifyPostPassword({
  postId,
  password,
}: VerifyPostPasswordParam): Promise<void> {
  const { error } = await supabase.functions.invoke("verify-post-password", {
    body: {
      postId,
      password,
    },
  });

  if (error) throw error;
}

export type DeletePostParam = {
  postId: string;
  password: string;
};

export async function deletePost({
  postId,
  password,
}: DeletePostParam): Promise<void> {
  const { error } = await supabase.functions.invoke("delete-post", {
    body: {
      postId,
      password,
    },
  });

  if (error) throw error;
}

export type UpdatePostParam = {
  postId: string;
  password: string;
  content: string;
};

type UpdatePostResponse = {
  postId: string;
};

export async function updatePost({
  postId,
  password,
  content,
}: UpdatePostParam): Promise<UpdatePostResponse> {
  const { data, error } = await supabase.functions.invoke<UpdatePostResponse>(
    "update-post",
    {
      body: {
        postId,
        password,
        content,
      },
    },
  );

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error("수정 응답이 없습니다.");
  }

  return data;
}
