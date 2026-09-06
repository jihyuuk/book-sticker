import { bookImages } from "./chart-images";

//랜덤 책
export function getBookImage(kidId: string, stickerIndex: number) {
  const seed = `${kidId}-${stickerIndex}`;

  let hash = 0;

  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }

  return bookImages[hash % bookImages.length];
}
