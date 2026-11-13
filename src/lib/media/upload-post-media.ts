import { supabase } from "@/lib/supabse";

import { uploadImage } from "./upload-image";
import { uploadVideo } from "./upload-video";
import { runUploadQueue } from "./upload-queue";

type Purpose = "BOOK_COVER" | "POST_IMAGE" | "POST_VIDEO";

type MediaType = "IMAGE" | "VIDEO";

// 프론트에서 선택한 파일
export type LocalMedia = {
  clientId: string;
  file: File;
  purpose: Purpose;
  durationSeconds?: number;
};

// Cloudflare 업로드 URL 정보
export type UploadTicket = {
  clientId: string;
  index: number;
  mediaId: string;
  mediaType: MediaType;
  purpose: Purpose;
  uploadUrl: string;
  uploadProtocol: "MULTIPART" | "TUS";
};

// Edge Function 응답
type UploadResponse = {
  uploadSessionId: string;
  uploads: UploadTicket[];
};

// 업로드 단계
export type UploadPhase = "PREPARING" | "COVER" | "MEDIA";

// 진행률 콜백
export type UploadOptions = {
  onPhaseChange?: (phase: UploadPhase) => void;

  onFileProgress?: (clientId: string, loaded: number, total: number) => void;
};

export async function uploadPostMedia(
  files: LocalMedia[],
  options: UploadOptions = {},
) {
  // 업로드할 파일이 없을 경우
  if (files.length === 0) {
    return {
      uploadSessionId: null,
      uploads: [] as UploadTicket[],
    };
  }

  // 파일 식별자 중복 검사
  const clientIds = files.map((file) => file.clientId);

  if (new Set(clientIds).size !== files.length) {
    throw new Error("중복된 파일 ID가 있습니다.");
  }

  // 1. 업로드 준비
  options.onPhaseChange?.("PREPARING");

  const { data, error } = await supabase.functions.invoke<UploadResponse>(
    "create-media-upload",
    {
      body: {
        files: files.map((item) => ({
          clientId: item.clientId,
          purpose: item.purpose,
          mediaType: item.purpose === "POST_VIDEO" ? "VIDEO" : "IMAGE",
          size: item.file.size,
          durationSeconds: item.durationSeconds,
        })),
      },
    },
  );

  if (error || !data) {
    throw new Error("업로드 URL 발급 실패");
  }

  if (data.uploads.length !== files.length) {
    throw new Error("업로드 URL 개수가 일치하지 않습니다.");
  }

  // 2. 파일별 업로드 URL 매칭
  const ticketMap = new Map(
    data.uploads.map((ticket) => [ticket.clientId, ticket]),
  );

  if (ticketMap.size !== files.length) {
    throw new Error("업로드 URL 정보가 중복되었습니다.");
  }

  // 3. 파일 하나 업로드하는 공통 함수
  const send = async (item: LocalMedia) => {
    const ticket = ticketMap.get(item.clientId);

    if (!ticket || ticket.purpose !== item.purpose) {
      throw new Error("파일 업로드 정보가 일치하지 않습니다.");
    }

    const onProgress = (loaded: number, total: number) => {
      options.onFileProgress?.(item.clientId, loaded, total);
    };

    if (item.purpose === "POST_VIDEO") {
      if (ticket.mediaType !== "VIDEO") {
        throw new Error("동영상 업로드 유형이 잘못되었습니다.");
      }

      await uploadVideo(item.file, ticket.uploadUrl, onProgress);
    } else {
      if (ticket.mediaType !== "IMAGE") {
        throw new Error("이미지 업로드 유형이 잘못되었습니다.");
      }

      await uploadImage(item.file, ticket.uploadUrl, onProgress);
    }
  };

  // 4. 책 표지 먼저 업로드
  const cover = files.find((item) => item.purpose === "BOOK_COVER");

  if (cover) {
    options.onPhaseChange?.("COVER");
    await send(cover);
  }

  // 5. 게시글 이미지와 동영상 분류
  const images = files.filter((item) => item.purpose === "POST_IMAGE");

  const videos = files.filter((item) => item.purpose === "POST_VIDEO");

  // 6. 사진 2개 + 영상 1개 병렬 업로드
  if (images.length > 0 || videos.length > 0) {
    options.onPhaseChange?.("MEDIA");

    await runUploadQueue({
      images,
      videos,
      upload: send,
    });
  }

  // 7. 모든 업로드 성공
  return {
    uploadSessionId: data.uploadSessionId,
    uploads: data.uploads,
  };
}
