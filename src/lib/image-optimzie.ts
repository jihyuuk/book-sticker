const IMAGE_CONFIG = {
  MAX_SIZE: 300 * 1024,
  OUTPUT_TYPE: "image/jpeg",

  ATTEMPTS: [
    { maxDimension: 1024, quality: 0.75 },
    { maxDimension: 1024, quality: 0.65 },
    { maxDimension: 1024, quality: 0.55 },
    { maxDimension: 896, quality: 0.65 },
    { maxDimension: 768, quality: 0.55 },
  ],
} as const;

export async function optimizeImage(file: File): Promise<File> {
  // 브라우저에서 원본 이미지 디코딩
  // HEIC 등 지원하지 않는 형식은 여기서 실패할 수 있음
  let image: ImageBitmap;

  try {
    image = await createImageBitmap(file, {
      imageOrientation: "from-image",
    });
  } catch {
    throw new Error("지원하지 않는 이미지 형식입니다.");
  }

  try {
    //for (const [index, attempt] of IMAGE_CONFIG.ATTEMPTS.entries()) {
    for (const attempt of IMAGE_CONFIG.ATTEMPTS) {
      const scale = Math.min(
        1,
        attempt.maxDimension / Math.max(image.width, image.height),
      );

      const width = Math.max(1, Math.round(image.width * scale));
      const height = Math.max(1, Math.round(image.height * scale));

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("Canvas 컨텍스트를 생성할 수 없습니다.");
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // JPEG는 투명도를 지원하지 않으므로 흰색 배경 적용
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);

      // 이미지 비율 유지하여 리사이징
      ctx.drawImage(image, 0, 0, width, height);

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

      // JPEG 인코딩 여부 확인
      if (blob.type !== IMAGE_CONFIG.OUTPUT_TYPE) {
        throw new Error("JPEG 변환을 지원하지 않는 브라우저입니다.");
      }

      // 300KB 이하라면 성공
      if (blob.size <= IMAGE_CONFIG.MAX_SIZE) {
        // alert(
        //   `이미지 최적화 성공!\n\n` +
        //     `시도 횟수: ${index + 1}회\n` +
        //     `해상도: ${width} × ${height}\n` +
        //     `품질: ${attempt.quality}\n` +
        //     `원본 용량: ${Math.round(file.size / 1024)}KB\n` +
        //     `최적화 용량: ${Math.round(blob.size / 1024)}KB\n` +
        //     `압축률: ${(100 - (blob.size / file.size) * 100).toFixed(1)}%`,
        // );

        return new File([blob], `${crypto.randomUUID()}.jpg`, {
          type: IMAGE_CONFIG.OUTPUT_TYPE,
        });
      }
    }

    throw new Error("이미지를 300KB 이하로 최적화하지 못했습니다.");
  } finally {
    image.close();
  }
}
