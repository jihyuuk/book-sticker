import { useEffect, useState } from "react";
import { X } from "lucide-react";

import { Drawer, DrawerContent } from "@/components/ui/drawer";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

import { useImageViewer } from "@/store/image-viewer-store";
import VideoPlayer from "../post-card/video-player";

export default function ImageViewer() {
  const { isOpen, media, initialIndex, actions } = useImageViewer();

  const [api, setApi] = useState<CarouselApi>();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!api || !isOpen) return;

    api.scrollTo(initialIndex, true);

    const updateIndex = () => {
      setCurrentIndex(api.selectedScrollSnap());
    };

    updateIndex();

    api.on("select", updateIndex);

    return () => {
      api.off("select", updateIndex);
    };
  }, [api, isOpen, initialIndex]);

  return (
    <Drawer
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) actions.close();
      }}
      direction="bottom"
    >
      <DrawerContent className="mt-0! h-dvh! max-h-none! rounded-none! border-0! bg-black! p-0! **:data-vaul-handle:hidden!">
        {/* 상단 닫기 버튼과 인디케이터 */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between px-4 pt-[max(16px,env(safe-area-inset-top))]">
          <button
            type="button"
            aria-label="닫기"
            onClick={actions.close}
            className="pointer-events-auto flex size-10 items-center justify-center rounded-full bg-[#333333] text-white"
          >
            <X className="size-6" />
          </button>

          {media.length > 1 && (
            <div className="rounded-full bg-[#333333] px-3 py-1.5 text-sm font-medium text-white tabular-nums">
              {currentIndex + 1} / {media.length}
            </div>
          )}
        </div>

        {/* 미디어 캐러셀 */}
        <Carousel
          setApi={setApi}
          opts={{
            startIndex: initialIndex,
            align: "start",
            loop: false,
          }}
          className="h-full w-full"
        >
          <CarouselContent className="ml-0">
            {media.map((item, index) => (
              <CarouselItem key={item.id} className="basis-full pl-0">
                <div className="box-border flex h-dvh w-full items-center justify-center pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
                  {item.type === "IMAGE" ? (
                    <img
                      src={item.url}
                      alt={`이미지 ${index + 1}`}
                      loading={index === initialIndex ? "eager" : "lazy"}
                      decoding="async"
                      draggable={false}
                      className="h-full w-full object-contain select-none"
                    />
                  ) : (
                    <VideoPlayer
                      url={item.url}
                      posterUrl={item.posterUrl}
                      isActive={isOpen && currentIndex === index}
                      fit="contain"
                    />
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </DrawerContent>
    </Drawer>
  );
}
