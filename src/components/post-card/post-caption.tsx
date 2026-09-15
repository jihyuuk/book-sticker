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
    <div className="px-4 pb-5">
      <p
        ref={ref}
        className={`text-sm leading-6 text-gray-700 ${
          expanded ? "" : "line-clamp-4"
        }`}
      >
        {caption}
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
