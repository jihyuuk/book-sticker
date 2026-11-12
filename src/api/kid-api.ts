import { getCloudflareProfileUrl } from "@/lib/cloudflare-image";
import { supabase } from "@/lib/supabse";
import type { Kid } from "@/types/entity-types";

type CreateKidParams = {
  classroomId: string;
  name: string;
  bookCount: number;
  profileImage?: File;
};

type UpdateKidParams = {
  kidId: string;
  name: string;
  bookCount: number;
  profileImage?: File | null;
};

// 반의 모든 원아 + 게시글 수 조회
export async function fetchKidsByClassroom(classroomId: string) {
  const { data, error } = await supabase
    .from("kid")
    .select(
      `
      *,
      posts:post(count)
    `,
    )
    .eq("classroom_id", classroomId)
    .order("name");

  if (error) throw error;

  return data.map(({ posts, ...kid }) => ({
    ...kid,
    profile_image_url: getCloudflareProfileUrl(kid.profile_image_id),
    post_count: posts?.[0]?.count ?? 0,
  }));
}

// 원아 생성
export async function createKid({
  classroomId,
  name,
  bookCount,
  profileImage,
}: CreateKidParams) {
  let profileMediaId: string | null = null;
  let uploadSessionId: string | null = null;

  // 1. Cloudflare에 프로필 이미지 업로드
  if (profileImage) {
    const result = await uploadProfileImage(profileImage);

    profileMediaId = result.mediaId;
    uploadSessionId = result.uploadSessionId;
  }

  // 2. 아이 생성 Edge Function V2 호출
  const { data, error } = await supabase.functions.invoke<Kid>(
    "create-kid-v2",
    {
      body: {
        classroomId,
        name: name.trim(),
        bookCount,
        profileMediaId,
        uploadSessionId,
      },
    },
  );

  if (error) throw error;
  if (!data) throw new Error("아이 등록 결과가 없습니다.");

  return data;
}

// 원아 수정
export async function updateKid({
  kidId,
  name,
  bookCount,
  profileImage,
}: UpdateKidParams): Promise<Kid> {
  // 1. 이미지 변경 상태 확인
  const imageAction =
    profileImage === undefined
      ? "KEEP"
      : profileImage === null
        ? "DELETE"
        : "UPLOAD";

  let profileMediaId: string | null = null;
  let uploadSessionId: string | null = null;

  // 2. 새 이미지가 있으면 Cloudflare에 업로드
  if (imageAction === "UPLOAD" && profileImage) {
    const uploaded = await uploadProfileImage(profileImage);

    profileMediaId = uploaded.mediaId;
    uploadSessionId = uploaded.uploadSessionId;
  }

  // 3. update-kid-v2 호출
  const { data, error } = await supabase.functions.invoke<Kid>(
    "update-kid-v2",
    {
      body: {
        kidId,
        name: name.trim(),
        bookCount,
        imageAction,
        profileMediaId,
        uploadSessionId,
      },
    },
  );

  if (error) throw error;
  if (!data) throw new Error("아이 수정 결과가 없습니다.");

  return data;
}

// 원아 삭제
export async function deleteKid(kidId: string) {
  const { error } = await supabase
    .from("kid")
    .delete()
    .eq("id", kidId)
    .select("id")
    .single();

  if (error) throw error;
}

type UploadResponse = {
  uploadSessionId: string;
  uploads: {
    mediaId: string;
    mediaType: string;
    purpose: string;
    uploadUrl: string;
  }[];
};

export async function uploadProfileImage(file: File) {
  // 1. 파일 검증
  if (!file.type.startsWith("image/")) {
    throw new Error("이미지 파일만 업로드할 수 있습니다.");
  }

  if (file.size > 10 * 1024 * 1024) {
    throw new Error("이미지는 10MB 이하여야 합니다.");
  }

  // 2. Cloudflare 업로드 URL 발급
  const { data, error } = await supabase.functions.invoke<UploadResponse>(
    "create-media-upload",
    {
      body: {
        files: [
          {
            mediaType: "IMAGE",
            purpose: "KID_PROFILE",
          },
        ],
      },
    },
  );

  if (error || !data?.uploads?.[0]) {
    throw new Error("업로드 URL 발급에 실패했습니다.");
  }

  const { mediaId, uploadUrl } = data.uploads[0];

  // 3. Cloudflare에 원본 이미지 업로드
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(uploadUrl, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("프로필 이미지 업로드에 실패했습니다.");
  }

  // 4. 결과 반환
  return {
    mediaId,
    uploadSessionId: data.uploadSessionId,
  };
}
