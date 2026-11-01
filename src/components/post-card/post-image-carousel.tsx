import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useOpenImageViewer } from "@/store/image-viewer-store";

type Props = {
  images: string[];
};

const margin = 20;

export default function PostImageCarousel({ images }: Props) {
  const openImageViewer = useOpenImageViewer();

  if (images.length === 0) return null;

  return (
    <Carousel
      opts={{
        align: (viewSize, snapSize, index) => {
          if (images.length === 1) return margin;

          if (index === images.length - 1) {
            return viewSize - snapSize - margin;
          }

          return margin;
        },
        containScroll: false,
        loop: false,
      }}
      className="w-full"
    >
      <CarouselContent className="mb-2 ml-0 gap-2">
        {images.map((src, index) => (
          <CarouselItem
            key={`${src}-${index}`}
            className={
              images.length === 1
                ? "basis-[calc(100%-40px)] pl-0"
                : "basis-[90%] pl-0"
            }
          >
            <div className="relative aspect-square overflow-hidden rounded-sm border bg-gray-100">
              <button
                type="button"
                className="h-full w-full"
                onClick={() =>
                  openImageViewer({
                    images,
                    initialIndex: index,
                  })
                }
              >
                {/* 이미지 */}
                <img
                  src={src}
                  alt={`게시글 이미지 ${index + 1}`}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </button>

              {/* 숫자 인디케이터 */}
              {images.length > 1 && (
                <div className="absolute top-3 right-3 rounded-full bg-black/50 px-2 py-1 text-xs font-medium text-white tabular-nums">
                  {index + 1}/{images.length}
                </div>
              )}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
