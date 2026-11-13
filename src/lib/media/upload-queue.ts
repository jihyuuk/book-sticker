type UploadQueueOptions<T> = {
  images: T[];
  videos: T[];
  upload: (item: T) => Promise<void>;
};

// 동시 업로드 제한
const IMAGE_CONCURRENCY = 2;
const VIDEO_CONCURRENCY = 1;

// 지정된 개수만큼 병렬 실행
async function runPool<T>(
  items: T[],
  limit: number,
  upload: (item: T) => Promise<void>,
): Promise<void> {
  let cursor = 0;
  let firstError: Error | null = null;

  const worker = async () => {
    while (cursor < items.length && !firstError) {
      const item = items[cursor++];

      try {
        await upload(item);
      } catch (error) {
        firstError =
          error instanceof Error ? error : new Error("파일 업로드 실패");
      }
    }
  };

  const workers = Array.from({ length: Math.min(limit, items.length) }, () =>
    worker(),
  );

  await Promise.all(workers);

  if (firstError) {
    throw firstError;
  }
}

// 사진 큐와 영상 큐를 동시에 실행
export async function runUploadQueue<T>({
  images,
  videos,
  upload,
}: UploadQueueOptions<T>): Promise<void> {
  const results = await Promise.allSettled([
    runPool(images, IMAGE_CONCURRENCY, upload),
    runPool(videos, VIDEO_CONCURRENCY, upload),
  ]);

  const failed = results.find((result) => result.status === "rejected");

  if (failed?.status === "rejected") {
    throw failed.reason;
  }
}
