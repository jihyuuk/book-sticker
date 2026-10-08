import {
  DEFALUT_CHART_SCALE,
  DEFAULT_GAP,
  INFO_HEIGHT,
  STICKER_SIZE,
} from "./constants";
import { bookImages } from "./chart-images";
import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "display-1",
            "display-2",
            "display-3",
            "display-4",
            "display-5",
            "display-6",

            "headline-1",
            "headline-2",
            "headline-3",
            "headline-4",
            "headline-5",
            "headline-6",

            "title-1",
            "title-2",
            "title-3",
            "title-4",

            "body-1",
            "body-2",
            "body-3",
            "body-4",

            "caption-1",
            "caption-2",
            "caption-3",

            "button-1",
            "button-2",
            "button-3",
            "button-4",

            "en-display-1",
            "en-display-2",
            "en-display-3",
            "en-display-4",
            "en-display-5",
            "en-display-6",

            "en-headline-1",
            "en-headline-2",
            "en-headline-3",
            "en-headline-4",
            "en-headline-5",
            "en-headline-6",

            "en-title-1",
            "en-title-2",
            "en-title-3",
            "en-title-4",

            "en-body-1",
            "en-body-2",
            "en-body-3",
            "en-body-4",

            "en-caption-1",
            "en-caption-2",
            "en-caption-3",

            "en-button-1",
            "en-button-2",
            "en-button-3",
            "en-button-4",
          ],
        },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getChartScale(maxBookCount: number) {
  const bookCount = Math.max(DEFALUT_CHART_SCALE - 10, maxBookCount);
  const scaleStep = bookCount >= 100 ? 20 : 10;

  const chartMaxBookCount =
    Math.floor(bookCount / scaleStep) * scaleStep + scaleStep;

  const scaleCount = Math.floor(chartMaxBookCount / scaleStep);

  const scaleValues = Array.from(
    { length: scaleCount },
    (_, index) => (index + 1) * scaleStep,
  );

  return {
    chartMaxBookCount,
    scaleValues,
  };
}

export function getStickerGap(bookCount: number, chartHeight: number) {
  if (bookCount <= 1) return 0;

  const stickerAreaHeight = Math.max(chartHeight - INFO_HEIGHT, 0);

  return Math.min(
    STICKER_SIZE + DEFAULT_GAP,
    (stickerAreaHeight - STICKER_SIZE) / (bookCount - 1),
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

//랜덤 책
export function getBookImage(kidId: string, stickerIndex: number) {
  const seed = `${kidId}-${stickerIndex}`;

  let hash = 0;

  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }

  return bookImages[hash % bookImages.length];
}

export function formatRelativeTime(dateString: string) {
  const now = new Date();
  const date = new Date(dateString);

  const diffMs = now.getTime() - date.getTime();

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const month = 30 * day;
  const year = 365 * day;

  if (diffMs < minute) {
    return "방금 전";
  }

  if (diffMs < hour) {
    return `${Math.floor(diffMs / minute)}분 전`;
  }

  if (diffMs < day) {
    return `${Math.floor(diffMs / hour)}시간 전`;
  }

  if (diffMs < month) {
    return `${Math.floor(diffMs / day)}일 전`;
  }

  if (diffMs < year) {
    return `${Math.floor(diffMs / month)}개월 전`;
  }

  return `${Math.floor(diffMs / year)}년 전`;
}
