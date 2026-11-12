import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useOpenMediaViewer } from "@/store/image-viewer-store";
import type { PostMedia } from "@/types/post-media";
import VideoPlayer from "./video-player";

export type { PostMedia } from "@/types/post-media";

type Props = {
  media: PostMedia[];
};

const margin = 20;

export default function PostMediaCarousel({ media }: Props) {
  const openMediaViewer = useOpenMediaViewer();

  const [api, setApi] = useState<CarouselApi>();
  const [activeIndex, setActiveIndex] = useState(0);

  // 캐러셀 활성 슬라이드 갱신
  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setActiveIndex(api.selectedScrollSnap());
    };

    onSelect();

    api.on("select", onSelect);
    api.on("reInit", onSelect);

    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  // PullToRefresh 터치 이벤트 충돌 방지
  useEffect(() => {
    if (!api) return;

    const viewport = api.rootNode();

    let startX = 0;
    let startY = 0;
    let direction: "x" | "y" | null = null;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;

      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      direction = null;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;

      const dx = Math.abs(e.touches[0].clientX - startX);
      const dy = Math.abs(e.touches[0].clientY - startY);

      if (!direction && Math.max(dx, dy) >= 3) {
        direction = dx > dy ? "x" : "y";
      }

      // 가로 스와이프는 PullToRefresh에 전달하지 않음
      if (direction !== "y") {
        e.stopPropagation();
      }
    };

    const onTouchEnd = () => {
      direction = null;
    };

    viewport.addEventListener("touchstart", onTouchStart, {
      passive: true,
    });
    viewport.addEventListener("touchmove", onTouchMove, {
      passive: true,
    });
    viewport.addEventListener("touchend", onTouchEnd);
    viewport.addEventListener("touchcancel", onTouchEnd);

    return () => {
      viewport.removeEventListener("touchstart", onTouchStart);
      viewport.removeEventListener("touchmove", onTouchMove);
      viewport.removeEventListener("touchend", onTouchEnd);
      viewport.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [api]);

  if (media.length === 0) return null;

  return (
    <Carousel
      setApi={setApi}
      opts={{
        align: (viewSize, snapSize, index) => {
          if (media.length === 1) return margin;

          if (index === media.length - 1) {
            return viewSize - snapSize - margin;
          }

          return margin;
        },
        containScroll: false,
        loop: false,

        // 동영상 컨트롤 클릭 시 드래그 방지
        watchDrag: (_, event) => {
          const target = event.target;

          if (!(target instanceof Element)) return true;

          const isVideoControl = target.closest(
            "button[aria-label], input[type='range']",
          );

          return !isVideoControl;
        },
      }}
      className="w-full"
    >
      <CarouselContent className="mb-2 ml-0 touch-pan-y gap-2">
        {media.map((item, index) => (
          <CarouselItem
            key={item.id}
            className={
              media.length === 1
                ? "basis-[calc(100%-40px)] pl-0"
                : "basis-[90%] pl-0"
            }
          >
            <div className="relative aspect-square overflow-hidden rounded-sm border bg-gray-100">
              {item.type === "IMAGE" ? (
                <button
                  type="button"
                  className="h-full w-full"
                  onClick={() => {
                    openMediaViewer({
                      media,
                      initialIndex: index,
                    });
                  }}
                >
                  <img
                    src={item.url}
                    alt={`게시글 이미지 ${index + 1}`}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </button>
              ) : (
                <VideoPlayer
                  url={item.url}
                  posterUrl={item.posterUrl}
                  isActive={activeIndex === index}
                />
              )}

              {media.length > 1 && (
                <div className="pointer-events-none absolute top-3 right-3 rounded-full bg-black/50 px-2 py-1 text-xs font-medium text-white tabular-nums">
                  {index + 1}/{media.length}
                </div>
              )}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
