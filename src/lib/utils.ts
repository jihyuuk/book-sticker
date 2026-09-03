import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { DEFAULT_GAP, STICKER_SIZE } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getStickerGap(bookCount: number, chartHeight: number) {
  if (bookCount <= 1) return 0;

  return Math.min(
    STICKER_SIZE + DEFAULT_GAP,
    (chartHeight - STICKER_SIZE) / (bookCount - 1),
  );
}

export function getRainbowBackground(index: number, total: number) {
  if (total <= 0) return "";

  const hue = (index / total) * 300;

  // return `linear-gradient(
  //   to bottom,
  //   hsla(${hue}, 70%, 88%, 0.45) 0%,
  //   hsla(${hue}, 65%, 92%, 0.25) 100%
  // )`;

  return `hsla(${hue}, 70%, 88%, 0.45)`;
}
