import * as tus from "tus-js-client";
import type { UploadProgress } from "./upload-image";

export function uploadVideo(
  file: File,
  uploadUrl: string,
  onProgress?: UploadProgress,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const upload = new tus.Upload(file, {
      uploadUrl,

      chunkSize: 5 * 1024 * 1024,
      retryDelays: [0, 1000, 3000, 5000],

      onProgress(uploaded, total) {
        onProgress?.(uploaded, total);
      },

      onSuccess() {
        resolve();
      },

      onError(error) {
        reject(error);
      },
    });

    upload.start();
  });
}
