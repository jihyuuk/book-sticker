const MAX_SIZE = 1600;
const WEBP_QUALITY = 0.8;

export async function optimizePostImage(file: File): Promise<File> {
  const imageUrl = URL.createObjectURL(file);

  try {
    const image = await loadImage(imageUrl);

    const { width, height } = calculateSize(
      image.naturalWidth,
      image.naturalHeight,
    );

    const canvas = document.createElement("canvas");

    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("이미지를 처리할 수 없습니다.");
    }

    context.drawImage(image, 0, 0, width, height);

    const blob = await canvasToWebp(canvas);

    const fileName = file.name.replace(/\.[^/.]+$/, "");

    return new File([blob], `${fileName}.webp`, {
      type: "image/webp",
    });
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("이미지를 불러오지 못했습니다."));

    image.src = src;
  });
}

function calculateSize(width: number, height: number) {
  if (width <= MAX_SIZE && height <= MAX_SIZE) {
    return { width, height };
  }

  const ratio = Math.min(MAX_SIZE / width, MAX_SIZE / height);

  return {
    width: Math.round(width * ratio),
    height: Math.round(height * ratio),
  };
}

function canvasToWebp(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("이미지 변환에 실패했습니다."));
          return;
        }

        resolve(blob);
      },
      "image/webp",
      WEBP_QUALITY,
    );
  });
}
