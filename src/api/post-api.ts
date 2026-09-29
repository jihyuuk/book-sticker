import type { BookInfoData } from "@/components/book/book-info";
import { supabase } from "@/lib/supabse";
import type { PostCreateData, PostListData } from "@/types/data-types";

// ============================================================
// 타입
// ============================================================

// 게시글 비번 인증
export type PostPasswordParam = {
  postId: string;
  password: string;
};

// 게시글 생성
export type CreatePostParam = {
  publicId: string;
  kidId: string;
  book: BookInfoData;
  content: string;
  password: string;
  images: File[];
};

// 게시글 수정
export type UpdatePostImage =
  | {
      type: "existing";
      id: string;
    }
  | {
      type: "new";
      id: string;
      file: File;
    };

export type UpdatePostParam = PostPasswordParam & {
  content: string;
  images: UpdatePostImage[];
};

export type UpdatePostResponse = {
  postId: string;
  content: string;
  images: {
    id: string;
    imageUrl: string;
  }[];
};

// ============================================================
// 조회
// ============================================================

// 게시글 목록 조회
export async function fetchPostListData(
  publicId: string,
): Promise<PostListData | null> {
  const { data, error } = await supabase.functions.invoke<PostListData | null>(
    "fetch-public-posts",
    {
      body: {
        publicId,
      },
    },
  );

  if (error) throw error;

  return data;
}

// 게시글 생성시 필요한 데이터 조회
export async function fetchPostCreateData(
  publicId: string,
): Promise<PostCreateData | null> {
  const { data, error } = await supabase.rpc("get_public_kids", {
    p_public_id: publicId,
  });

  if (error) throw error;

  return data as unknown as PostCreateData | null;
}

// ============================================================
// 생성
// ============================================================

export async function createPost(
  params: CreatePostParam,
): Promise<{ postId: string }> {
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

  const { data, error } = await supabase.functions.invoke<{ postId: string }>(
    "create-post",
    {
      body: formData,
    },
  );

  if (error) throw error;
  if (!data) throw new Error("게시글 생성 응답이 없습니다.");

  return data;
}

// ============================================================
// 비밀번호 검증
// ============================================================

export async function verifyPostPassword({
  postId,
  password,
}: PostPasswordParam): Promise<void> {
  const { error } = await supabase.functions.invoke("verify-post-password", {
    body: {
      postId,
      password,
    },
  });

  if (error) throw error;
}

// ============================================================
// 수정
// ============================================================

export async function updatePost({
  postId,
  password,
  content,
  images,
}: UpdatePostParam): Promise<UpdatePostResponse> {
  const formData = new FormData();

  formData.append(
    "payload",
    JSON.stringify({
      postId,
      password,
      content,
      images: images.map((image) => ({
        type: image.type,
        id: image.id,
      })),
    }),
  );

  images.forEach((image) => {
    if (image.type === "new") {
      formData.append("images", image.file);
    }
  });

  const { data, error } = await supabase.functions.invoke<UpdatePostResponse>(
    "update-post",
    {
      body: formData,
    },
  );

  if (error) throw error;
  if (!data) throw new Error("수정 응답이 없습니다.");

  return data;
}

// ============================================================
// 삭제
// ============================================================

export async function deletePost({
  postId,
  password,
}: PostPasswordParam): Promise<void> {
  const { error } = await supabase.functions.invoke("delete-post", {
    body: {
      postId,
      password,
    },
  });

  if (error) throw error;
}
