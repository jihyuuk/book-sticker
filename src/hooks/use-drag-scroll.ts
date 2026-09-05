import { useRef } from "react";

export function useDragScroll() {
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // 모바일은 기존 터치 스크롤 사용
    if (e.pointerType !== "mouse") return;

    const element = e.currentTarget;

    isDragging.current = true;
    startX.current = e.clientX;
    scrollLeft.current = element.scrollLeft;

    element.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;

    const element = e.currentTarget;
    const distance = e.clientX - startX.current;

    element.scrollLeft = scrollLeft.current - distance;
  };

  const onPointerUp = () => {
    isDragging.current = false;
  };

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp,
  };
}
