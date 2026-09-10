import { useEffect, useRef, useState } from "react";
import type { TempProps } from "./post-card";

export default function PostCaption({ post }: TempProps) {
  return (
    <div className="px-4">
      <ExpandableText>{post.content}</ExpandableText>
    </div>
  );
}

function ExpandableText({ children }: { children: string }) {
  const ref = useRef<HTMLParagraphElement>(null);

  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    setIsOverflowing(element.scrollHeight > element.clientHeight);
  }, [children]);

  return (
    <div>
      <p
        ref={ref}
        className={`text-sm leading-6 text-gray-700 ${
          expanded ? "" : "line-clamp-4"
        }`}
      >
        {children}
      </p>

      {isOverflowing && (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="mt-1 text-sm font-medium text-gray-400"
        >
          {expanded ? "접기" : "더보기"}
        </button>
      )}
    </div>
  );
}
