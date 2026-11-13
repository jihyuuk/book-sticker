export type UploadProgress = (loaded: number, total: number) => void;

export function uploadImage(
  file: File,
  uploadUrl: string,
  onProgress?: UploadProgress,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();

    formData.append("file", file);

    xhr.open("POST", uploadUrl);

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) return;

      onProgress?.(event.loaded, event.total);
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(new Error("이미지 업로드 실패"));
      }
    };

    xhr.onerror = () => {
      reject(new Error("이미지 전송 중 네트워크 오류"));
    };

    xhr.onabort = () => {
      reject(new Error("이미지 업로드 취소"));
    };

    xhr.send(formData);
  });
}
