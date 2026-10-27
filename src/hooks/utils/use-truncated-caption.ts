import { useLayoutEffect, useRef, useState } from "react";

export function useTruncatedCaption(caption: string | null) {
  const measureRef = useRef<HTMLParagraphElement>(null);
  const candidateRef = useRef<HTMLParagraphElement>(null);
  const candidateTextRef = useRef<HTMLSpanElement>(null);

  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [truncatedCaption, setTruncatedCaption] = useState("");

  useLayoutEffect(() => {
    const measure = measureRef.current;
    const candidate = candidateRef.current;
    const candidateText = candidateTextRef.current;

    if (!measure || !candidate || !candidateText || !caption) return;

    // 원본 텍스트 넘침 확인
    const overflowing = measure.scrollHeight > measure.clientHeight + 1;

    setIsOverflowing(overflowing);
    setExpanded(false);

    if (!overflowing) {
      setTruncatedCaption(caption);
      return;
    }

    // 이진 탐색으로 잘림 위치 계산
    const chars = Array.from(caption);
    let left = 0;
    let right = chars.length;
    let result = "";

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const text = chars.slice(0, mid).join("").trimEnd();

      candidateText.textContent = text;

      if (candidate.scrollHeight <= candidate.clientHeight + 1) {
        result = text;
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    setTruncatedCaption(result);
  }, [caption]);

  return {
    measureRef,
    candidateRef,
    candidateTextRef,
    expanded,
    setExpanded,
    isOverflowing,
    truncatedCaption,
  };
}
