import redBook from "@/assets/book/red-book.webp";
import yellowBook from "@/assets/book/yellow-book.webp";
import greenBook from "@/assets/book/green-book.webp";
import blueBook from "@/assets/book/blue-book.webp";

//랜덤 책
export const bookImages = [redBook, yellowBook, greenBook, blueBook];
export function getBookImage(kidId: string, stickerIndex: number) {
  const seed = `${kidId}-${stickerIndex}`;

  let hash = 0;

  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }

  return bookImages[hash % bookImages.length];
}
