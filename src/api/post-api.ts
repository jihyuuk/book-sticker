import {
  uploadPostMedia,
  type UploadPhase,
} from "@/lib/media/upload-post-media";
import { getKidProfileUrl } from "@/lib/storage-path-to-url";
import { supabase } from "@/lib/supabse";
import type {
  PostCreateData,
  PublicBook,
  PublicPost,
  PublicPostsPageData,
} from "@/types/dto/public-dto";

// ============================================================
// 타입
// ============================================================

//publicPost 조회 파라미터
type FetchPublicPostParams = {
  publicId: string;
  cursor: string | null;
};

// 게시글 생성
export type CreatePostMedia = {
  id: string;
  type: "IMAGE" | "VIDEO";
  file: File;
  durationSeconds?: number;
};

export type CreatePostParam = {
  publicId: string;
  kidId: string;
  book: Omit<PublicBook, "id"> & {
    coverImageFile: File | null;
  };
  content: string;
  password: string;
  media: CreatePostMedia[];
};

export type CreatePostOptions = {
  onPhaseChange?: (phase: UploadPhase | "SAVING" | "COMPLETED") => void;

  onFileProgress?: (clientId: string, loaded: number, total: number) => void;
};

// 게시글 비번 인증
export type PostPasswordParam = {
  postId: string;
  password: string;
};

// 게시글 수정: 기존 첨부는 DB ID만 전송하고 신규 첨부만 업로드합니다.
export type UpdatePostMedia =
  | { type: "existing"; id: string }
  | {
      type: "new";
      id: string; // UI 임시 ID / 업로드 진행률 key
      mediaType: "IMAGE" | "VIDEO";
      file: File;
      durationSeconds?: number;
    };

export type UpdatePostParam = PostPasswordParam & {
  content: string;
  media: UpdatePostMedia[]; // 배열 순서 그대로 sort_order 적용
};

export type UpdatePostOptions = CreatePostOptions;

export type UpdatePostResponse = {
  post: PublicPost;
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
    "fetch-public-posts-v2",
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

  const response = data as PostCreateData;

  return {
    ...response,
    kids: response.kids.map((kid) => ({
      ...kid,
      profileImageUrl: getKidProfileUrl(kid.profileImageUrl),
    })),
  };
}

// ============================================================
// 생성
// ============================================================

export async function createPost(
  params: CreatePostParam,
  options: CreatePostOptions = {},
): Promise<{ postId: string }> {
  const { publicId, kidId, book, content, password, media } = params;

  const { coverImageFile, ...bookData } = book;

  // 1. Cloudflare 업로드 대상 구성
  const files = [
    ...(coverImageFile
      ? [
          {
            clientId: "book-cover",
            file: coverImageFile,
            purpose: "BOOK_COVER" as const,
          },
        ]
      : []),

    ...media.map((item) => ({
      clientId: item.id,
      file: item.file,
      purpose:
        item.type === "VIDEO"
          ? ("POST_VIDEO" as const)
          : ("POST_IMAGE" as const),
      durationSeconds: item.durationSeconds,
    })),
  ];

  // 2. 업로드 준비 → 표지 → 사진·영상 업로드
  const uploaded = await uploadPostMedia(files, {
    onPhaseChange: options.onPhaseChange,
    onFileProgress: options.onFileProgress,
  });

  // 3. 업로드 결과 매핑
  const uploadedMap = new Map(
    uploaded.uploads.map((item) => [item.clientId, item]),
  );

  const coverMediaId = coverImageFile
    ? uploadedMap.get("book-cover")?.mediaId
    : null;

  if (coverImageFile && !coverMediaId) {
    throw new Error("책 표지 업로드 결과가 없습니다.");
  }

  const postMedia = media.map((item, index) => {
    const uploadedItem = uploadedMap.get(item.id);

    if (!uploadedItem) {
      throw new Error("게시글 첨부 업로드 결과가 없습니다.");
    }

    return {
      mediaId: uploadedItem.mediaId,
      mediaType: item.type,
      sortOrder: index,
    };
  });

  // 4. 게시글 DB 저장
  options.onPhaseChange?.("SAVING");

  const { data, error } = await supabase.functions.invoke<{
    postId: string;
  }>("create-post-v2", {
    body: {
      publicId,
      kidId,
      book: bookData,
      content,
      password,
      uploadSessionId: uploaded.uploadSessionId,
      coverMediaId,
      media: postMedia,
    },
  });

  if (error) throw error;
  if (!data) {
    throw new Error("게시글 생성 응답이 없습니다.");
  }

  options.onPhaseChange?.("COMPLETED");

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

export async function updatePost(
  { postId, password, content, media }: UpdatePostParam,
  options: UpdatePostOptions = {},
): Promise<UpdatePostResponse> {
  if (media.length > 5) {
    throw new Error("사진과 동영상은 합계 5개까지 등록할 수 있습니다.");
  }

  const newMedia = media.filter(
    (item): item is Extract<UpdatePostMedia, { type: "new" }> =>
      item.type === "new",
  );

  let uploadSessionId: string | null = null;
  const uploadedMap = new Map<string, string>();

  if (newMedia.length > 0) {
    // 비밀번호가 틀리면 대용량 파일을 먼저 업로드하지 않도록 사전 확인.
    // update-post-v2에서도 반드시 비밀번호를 재검증합니다.
    await verifyPostPassword({ postId, password });

    const uploaded = await uploadPostMedia(
      newMedia.map((item) => ({
        clientId: item.id,
        file: item.file,
        purpose:
          item.mediaType === "VIDEO"
            ? ("POST_VIDEO" as const)
            : ("POST_IMAGE" as const),
        durationSeconds: item.durationSeconds,
      })),
      {
        onPhaseChange: options.onPhaseChange,
        onFileProgress: options.onFileProgress,
      },
    );

    uploadSessionId = uploaded.uploadSessionId;
    for (const item of uploaded.uploads) {
      uploadedMap.set(item.clientId, item.mediaId);
    }
  }

  // 기존 DB 행 ID와 새로운 Cloudflare ID를 최종 순서대로 전달.
  const finalMedia = media.map((item) => {
    if (item.type === "existing") {
      return { type: "existing" as const, id: item.id };
    }

    const mediaId = uploadedMap.get(item.id);
    if (!mediaId) {
      throw new Error("새 첨부파일의 업로드 결과가 없습니다.");
    }
    return {
      type: "new" as const,
      mediaId,
      mediaType: item.mediaType,
    };
  });

  options.onPhaseChange?.("SAVING");

  // 업로드를 한 번이라도 시작했다면 실패 시에도 temp_media에서 자동 정리됩니다.
  // RPC 커밋 여부가 불확실한 오류에는 같은 요청을 자동 재시도하지 마세요.
  const { data, error } = await supabase.functions.invoke<UpdatePostResponse>(
    "update-post-v2",
    {
      body: {
        postId,
        password,
        content,
        uploadSessionId,
        media: finalMedia,
      },
    },
  );

  if (error) throw error;

  if (!data?.post || data.post.id !== postId) {
    throw new Error("게시글 수정 응답이 올바르지 않습니다.");
  }

  options.onPhaseChange?.("COMPLETED");
  return data;
}

// ============================================================
// 삭제
// ============================================================

export async function deletePost({
  postId,
  password,
}: PostPasswordParam): Promise<void> {
  const { error } = await supabase.functions.invoke("delete-post-v2", {
    body: {
      postId,
      password,
    },
  });

  if (error) throw error;
}
