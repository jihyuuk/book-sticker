import { cn } from "@/lib/utils";
import { useState } from "react";
import FALLBACK_IMAGE from "@/assets/fallback-book.svg";
import { useOpenImageViewer } from "@/store/image-viewer-store";
import type { PublicBook } from "@/types/dto/public-dto";

type Props = {
  book: Omit<PublicBook, "id">;
  className?: string;
};

// 책 표지 이미지 전용 컴포넌트
function BookCover({ src, title }: { src: string | null; title: string }) {
  const openImageViewer = useOpenImageViewer();

  // 현재 표시할 이미지와 로딩 완료 여부 관리
  const [imageSrc, setImageSrc] = useState(src || FALLBACK_IMAGE);
  const [isLoaded, setIsLoaded] = useState(false);

  // 이미지 로딩 실패 시 기본 이미지로 교체
  const handleError = () => {
    if (imageSrc !== FALLBACK_IMAGE) {
      setIsLoaded(false);
      setImageSrc(FALLBACK_IMAGE);
    }
  };

  const canOpen = !!src && imageSrc !== FALLBACK_IMAGE && isLoaded;

  return (
    <button
      type="button"
      disabled={!canOpen}
      onClick={() =>
        openImageViewer({
          images: [imageSrc],
        })
      }
      aria-label={`${title} 표지 크게 보기`}
      className={cn(
        "aspect-20/29 h-18 shrink-0 overflow-hidden rounded-xs bg-gray-100",
      )}
    >
      {/* 로딩 중에는 회색 배경만 표시 */}
      <img
        src={imageSrc}
        alt={title}
        onLoad={() => setIsLoaded(true)}
        onError={handleError}
        loading="lazy"
        decoding="async"
        className={cn(
          "h-full w-full",
          imageSrc === FALLBACK_IMAGE ? "object-contain" : "object-cover",
          !isLoaded && "opacity-0",
        )}
      />
    </button>
  );
}

export default function BookInfo({ book, className }: Props) {
  return (
    <div className={cn("flex gap-3", className)}>
      <BookCover
        key={book.coverUrl ?? "no-cover"}
        src={book.coverUrl}
        title={book.title}
      />

      <div className="min-w-0 flex-1">
        <div className="grid grid-cols-[48px_1fr] text-xs">
          <span className="col-span-2 mb-1 truncate text-sm font-semibold text-gray-600">
            {book.title}
          </span>

          <span className="text-gray-400">저자</span>
          <span className="truncate text-gray-600">{book.author ?? "-"}</span>

          <span className="text-gray-400">출판사</span>
          <span className="truncate text-gray-600">
            {book.publisher ?? "-"}
          </span>

          <span className="text-gray-400">ISBN</span>
          <span className="truncate text-gray-600">{book.isbn ?? "-"}</span>
        </div>
      </div>
    </div>
  );
}
