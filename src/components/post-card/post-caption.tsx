import { useEffect, useRef, useState } from "react";

type Props = {
  caption: string | null;
};

export default function PostCaption({ caption }: Props) {
  const ref = useRef<HTMLParagraphElement>(null);

  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    setIsOverflowing(element.scrollHeight > element.clientHeight);
  }, [caption]);

  if (!caption?.trim()) return null;

  return (
    <div className="px-page-x py-3">
      <button
        type="button"
        disabled={!isOverflowing}
        aria-expanded={expanded}
        onClick={() => setExpanded((prev) => !prev)}
        className="block w-full cursor-default! text-left"
      >
        <p
          ref={ref}
          className={`text-body-2 px-1 wrap-break-word whitespace-pre-wrap text-gray-700 ${
            expanded ? "" : "line-clamp-4"
          }`}
        >
          {caption}
        </p>

        {isOverflowing && !expanded && (
          <span className="text-sm font-medium text-gray-400">... 더보기</span>
        )}
      </button>
    </div>
  );
}
