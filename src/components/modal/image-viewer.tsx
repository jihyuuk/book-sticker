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

export default function ImageViewer() {
  const { isOpen, images, initialIndex, actions } = useImageViewer();

  const [api, setApi] = useState<CarouselApi>();
  const [currentIndex, setCurrentIndex] = useState(0);

  // 캐러셀의 현재 인덱스 관리
  useEffect(() => {
    if (!api || !isOpen) return;

    // 클릭한 이미지부터 시작
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

          {/* 이미지가 2장 이상일 때만 표시 */}
          {images.length > 1 && (
            <div className="rounded-full bg-[#333333] px-3 py-1.5 text-sm font-medium text-white tabular-nums">
              {currentIndex + 1} / {images.length}
            </div>
          )}
        </div>

        {/* 이미지 캐러셀 */}
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
            {images.map((src, index) => (
              <CarouselItem key={`${src}-${index}`} className="basis-full pl-0">
                <div className="flex h-dvh w-full items-center justify-center">
                  <img
                    src={src}
                    alt={`이미지 ${index + 1}`}
                    loading={index === initialIndex ? "eager" : "lazy"}
                    decoding="async"
                    draggable={false}
                    className="h-full w-full object-contain select-none"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </DrawerContent>
    </Drawer>
  );
}
