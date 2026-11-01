import { useCallback, useEffect, useId, useRef } from "react";
import type { ReactNode } from "react";
import PullToRefresh from "react-simple-pull-to-refresh";
import TailSpinner from "@/components/pull-to-refresh/tail-spinner";

const THRESHOLD = 67;
const MAX_PULL_DISTANCE = 95;

const COLOR = "#9ca3af";
const SIZE = 25;
const SPEED = 0.9;
const STROKE = 3;

type Props = {
  children: ReactNode;
  onRefresh: () => Promise<unknown>;
  isPullable?: boolean;
};

export default function CustomPullToRefresh({
  children,
  onRefresh,
  isPullable = true,
}: Props) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const scopeClass = `book-ptr-${id}`;

  const maskRef = useRef<HTMLDivElement>(null);
  const spinRef = useRef<HTMLDivElement>(null);

  const onRefreshRef = useRef(onRefresh);
  useEffect(() => {
    onRefreshRef.current = onRefresh;
  }, [onRefresh]);

  // 실제 당김 진행률 반영
  useEffect(() => {
    const pullDown = document.querySelector<HTMLElement>(
      `.${scopeClass} .ptr__pull-down`,
    );

    if (!pullDown) return;

    const updateProgress = () => {
      const opacity = Number(pullDown.style.opacity || 0);

      const progress = Math.max(0, Math.min(1, opacity));
      const angle = progress * 360;

      // Tailspin 회전
      if (spinRef.current) {
        spinRef.current.style.transform = `rotate(${angle}deg)`;
      }

      // 12시부터 시계 방향으로 표시 영역 확장
      if (maskRef.current) {
        const mask = `conic-gradient(
          from 0deg,
          black 0deg ${angle}deg,
          transparent ${angle}deg 360deg
        )`;

        maskRef.current.style.maskImage = mask;
        maskRef.current.style.webkitMaskImage = mask;
      }
    };

    const observer = new MutationObserver(updateProgress);

    observer.observe(pullDown, {
      attributes: true,
      attributeFilter: ["style"],
    });

    updateProgress();

    return () => observer.disconnect();
  }, [scopeClass]);

  // 새로고침
  const handleRefresh = useCallback(async () => {
    await onRefreshRef.current();
  }, []);

  return (
    <PullToRefresh
      isPullable={isPullable}
      className={scopeClass}
      onRefresh={handleRefresh}
      pullDownThreshold={THRESHOLD}
      maxPullDownDistance={MAX_PULL_DISTANCE}
      resistance={1}
      pullingContent={
        <div className="flex h-16 items-center justify-center pb-5">
          <div
            ref={maskRef}
            style={{
              width: SIZE,
              height: SIZE,
              maskImage: "conic-gradient(transparent 0deg 360deg)",
              WebkitMaskImage: "conic-gradient(transparent 0deg 360deg)",
            }}
          >
            <div
              ref={spinRef}
              style={{
                width: SIZE,
                height: SIZE,
                transform: "rotate(0deg)",
              }}
            >
              <TailSpinner
                color={COLOR}
                size={SIZE}
                speed={0}
                stroke={STROKE}
              />
            </div>
          </div>
        </div>
      }
      refreshingContent={
        <div className="flex h-16 items-center justify-center pb-5">
          <TailSpinner
            color={COLOR}
            size={SIZE}
            speed={SPEED}
            stroke={STROKE}
          />
        </div>
      }
    >
      {children}
    </PullToRefresh>
  );
}
