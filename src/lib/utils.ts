import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  DEFALUT_CHART_SCALE,
  DEFAULT_GAP,
  INFO_HEIGHT,
  STICKER_SIZE,
} from "./constants";

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
