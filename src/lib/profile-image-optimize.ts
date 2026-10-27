const IMAGE_CONFIG = {
  TARGET_SIZE: 100 * 1024,
  MAX_SIZE: 200 * 1024,
  OUTPUT_TYPE: "image/jpeg",

  //   ATTEMPTS: [
  //     { size: 512, quality: 0.8 },
  //     { size: 512, quality: 0.7 },
  //     { size: 448, quality: 0.7 },
  //     { size: 384, quality: 0.65 },
  //     { size: 320, quality: 0.55 },
  //   ],

  ATTEMPTS: [
    { size: 256, quality: 0.8 },
    { size: 256, quality: 0.7 },
    { size: 256, quality: 0.6 },
    { size: 224, quality: 0.65 },
    { size: 192, quality: 0.55 },
  ],
} as const;

export async function optimizeKidProfileImage(file: File): Promise<File> {
  let image: ImageBitmap;

  try {
    image = await createImageBitmap(file, {
      imageOrientation: "from-image",
    });
  } catch {
    throw new Error("지원하지 않는 이미지 형식입니다.");
  }

  try {
    // 중앙 기준 정사각형 크롭 영역
    const cropSize = Math.min(image.width, image.height);
    const sx = (image.width - cropSize) / 2;
    const sy = (image.height - cropSize) / 2;

    let bestBlob: Blob | null = null;

    for (const attempt of IMAGE_CONFIG.ATTEMPTS) {
      // 작은 원본은 강제로 확대하지 않음
      const size = Math.max(1, Math.min(cropSize, attempt.size));

      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;

      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("Canvas 컨텍스트를 생성할 수 없습니다.");
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // 투명 이미지의 배경을 흰색으로 처리
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, size, size);

      // 중앙 크롭 + 리사이징
      ctx.drawImage(image, sx, sy, cropSize, cropSize, 0, 0, size, size);

      // JPEG 인코딩
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (result) => {
            if (result) {
              resolve(result);
            } else {
              reject(new Error("이미지 변환에 실패했습니다."));
            }
          },
          IMAGE_CONFIG.OUTPUT_TYPE,
          attempt.quality,
        );
      });

      if (blob.type !== IMAGE_CONFIG.OUTPUT_TYPE) {
        throw new Error("JPEG 변환을 지원하지 않는 브라우저입니다.");
      }

      // 목표 용량 달성
      if (blob.size <= IMAGE_CONFIG.TARGET_SIZE) {
        return new File([blob], `${crypto.randomUUID()}.jpg`, {
          type: IMAGE_CONFIG.OUTPUT_TYPE,
        });
      }

      // 목표 용량 초과 시 가장 작은 결과 보관
      if (!bestBlob || blob.size < bestBlob.size) {
        bestBlob = blob;
      }
    }

    // 목표 용량은 초과했지만 최대 허용 용량 이내
    if (bestBlob && bestBlob.size <= IMAGE_CONFIG.MAX_SIZE) {
      return new File([bestBlob], `${crypto.randomUUID()}.jpg`, {
        type: IMAGE_CONFIG.OUTPUT_TYPE,
      });
    }

    throw new Error("이미지를 200KB 이하로 최적화하지 못했습니다.");
  } finally {
    image.close();
  }
}
