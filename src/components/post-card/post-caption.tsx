import { useTruncatedCaption } from "@/hooks/utils/use-truncated-caption";
import type { CSSProperties } from "react";

type Props = {
  caption: string | null;
};

// 최대 표시 줄 수
const MAX_LINES = 3;

const TEXT_CLASS =
  "text-body-2 px-1 wrap-break-word whitespace-pre-wrap text-gray-700";

const MORE_CLASS = "text-sm font-medium text-gray-400";

const MEASURE_CLASS = `${TEXT_CLASS} pointer-events-none invisible absolute inset-x-0 top-0`;

// 측정용 줄 수 제한
const CLAMP_STYLE: CSSProperties = {
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: MAX_LINES,
  overflow: "hidden",
};

export default function PostCaption({ caption }: Props) {
  const {
    measureRef,
    candidateRef,
    candidateTextRef,
    expanded,
    setExpanded,
    isOverflowing,
    truncatedCaption,
  } = useTruncatedCaption(caption);

  if (!caption?.trim()) return null;

  return (
    <div className="px-page-x py-3">
      <div className="relative">
        {/* 원본 측정 */}
        <p
          ref={measureRef}
          aria-hidden="true"
          className={MEASURE_CLASS}
          style={CLAMP_STYLE}
        >
          {caption}
        </p>

        {/* 잘림 위치 측정 */}
        <p
          ref={candidateRef}
          aria-hidden="true"
          className={MEASURE_CLASS}
          style={CLAMP_STYLE}
        >
          <span ref={candidateTextRef} />
          <span className={MORE_CLASS}> ... 더보기</span>
        </p>

        {/* 실제 표시 */}
        <button
          type="button"
          disabled={!isOverflowing}
          aria-expanded={expanded}
          onClick={() => setExpanded((prev) => !prev)}
          className="block w-full cursor-default! text-left"
        >
          <span className={`${TEXT_CLASS} block`}>
            {isOverflowing && !expanded ? (
              <>
                {truncatedCaption}
                <span className={MORE_CLASS}> ... 더보기</span>
              </>
            ) : (
              caption
            )}
          </span>
        </button>
      </div>
    </div>
  );
}
