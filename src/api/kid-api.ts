import { getKidProfileUrl } from "@/lib/storage-path-to-url";
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
    profile_image_url: getKidProfileUrl(kid.profile_image_url),
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
  const formData = new FormData();

  // 원아 정보
  formData.append(
    "payload",
    JSON.stringify({
      classroomId,
      name: name.trim(),
      bookCount,
    }),
  );

  // 프로필 이미지 (선택)
  if (profileImage) {
    formData.append("profile_image_file", profileImage);
  }

  const { data, error } = await supabase.functions.invoke<Kid>("create-kid", {
    body: formData,
  });

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
}: UpdateKidParams) {
  const formData = new FormData();

  // 아이 정보
  formData.append(
    "payload",
    JSON.stringify({
      kidId,
      name: name.trim(),
      bookCount,
      deleteProfileImage: profileImage === null,
    }),
  );

  // 프로필 이미지 (추가 또는 변경)
  if (profileImage instanceof File) {
    formData.append("profile_image_file", profileImage);
  }

  const { data, error } = await supabase.functions.invoke<Kid>("update-kid", {
    body: formData,
  });

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
