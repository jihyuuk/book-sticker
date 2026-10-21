import { cn } from "@/lib/utils";
import { useState } from "react";
import FALLBACK_IMAGE from "@/assets/no-book-cover.png";
import { useOpenImageViewer } from "@/store/image-viewer-store";

export type BookInfoData = {
  isbn: string | null;
  title: string;
  author: string | null;
  publisher: string | null;
  cover_url: string | null;
};

type Props = {
  book: BookInfoData;
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
        "aspect-20/29 h-18 shrink-0 overflow-hidden rounded-sm bg-gray-100",
      )}
    >
      {/* 로딩 중에는 회색 배경만 표시 */}
      <img
        src={imageSrc}
        alt={title}
        onLoad={() => setIsLoaded(true)}
        onError={handleError}
        className={cn("h-full w-full object-cover", !isLoaded && "opacity-0")}
      />
    </button>
  );
}

export default function BookInfo({ book, className }: Props) {
  return (
    <div className={cn("flex gap-3", className)}>
      <BookCover
        key={book.cover_url ?? "no-cover"}
        src={book.cover_url}
        title={book.title}
      />

      <div className="min-w-0 flex-1">
        <div className="grid grid-cols-[48px_1fr] text-xs">
          <span className="col-span-2 mb-1 truncate text-sm font-semibold text-gray-600">
            {book.title}
          </span>

          <span className="text-gray-400">저자</span>
          <span className="truncate text-gray-600">{book.author ?? "-"}</span>

          <span className="text-gray-400">발행처</span>
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
