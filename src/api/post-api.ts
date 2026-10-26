import type { BookInfoData } from "@/components/book/book-info";
import { supabase } from "@/lib/supabse";
import type {
  PostCreateData,
  PublicPostsPageData,
} from "@/types/dto/public-dto";

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
  book: BookInfoData & {
    coverImageFile: File | null;
  };
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

//publicPost 조회 파라미터
type FetchPublicPostParams = {
  publicId: string;
  cursor: string | null;
};

// ============================================================
// 조회
// ============================================================

// 게시글 목록 조회
export async function fetchPublicPosts({
  publicId,
  cursor,
}: FetchPublicPostParams): Promise<PublicPostsPageData> {
  const { data, error } = await supabase.functions.invoke<PublicPostsPageData>(
    "fetch-public-posts",
    {
      body: {
        publicId,
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

// 게시글 생성시 필요한 데이터 조회
export async function fetchPostCreateData(
  publicId: string,
): Promise<PostCreateData | null> {
  const { data, error } = await supabase.rpc("get_public_post_create_data", {
    p_public_id: publicId,
  });

  if (error) throw error;

  if (!data) {
    throw new Error("존재하지 않거나 공개되지 않은 반입니다.");
  }

  return data as PostCreateData;
}

// ============================================================
// 생성
// ============================================================

export async function createPost(
  params: CreatePostParam,
): Promise<{ postId: string }> {
  const { publicId, kidId, book, content, password, images } = params;

  // 파일과 책 정보 분리
  const { coverImageFile, ...bookData } = book;

  const formData = new FormData();

  // JSON 데이터
  formData.append(
    "payload",
    JSON.stringify({
      publicId,
      kidId,
      book: bookData,
      content,
      password,
    }),
  );

  // 책 표지 파일
  if (coverImageFile) {
    formData.append("cover_image_file", coverImageFile);
  }

  // 게시글 이미지
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
