import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

type Props = {
  images: string[];
};

export default function PostImageCarousel({ images }: Props) {
  if (images.length === 0) return null;

  if (images.length === 1)
    return (
      <div className="px-page-x mb-2">
        <div className="aspect-square overflow-hidden rounded-sm bg-gray-100">
          {/* 이미지 */}
          <img
            src={images[0]}
            alt={"게시글 이미지"}
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    );

  return (
    <Carousel
      opts={{
        align: "start",
        containScroll: "trimSnaps",
        loop: false,
      }}
      className="w-full"
    >
      <CarouselContent className="mb-2 ml-0 gap-2">
        {images.map((src, index) => (
          <CarouselItem
            key={`${src}-${index}`}
            className={`first:ml-page-x last:mr-page-x basis-[85%] overflow-hidden rounded-sm pl-0 only:basis-[calc(100%-var(--spacing-page-x)*2)]`}
          >
            <div className="relative aspect-square overflow-hidden bg-gray-100">
              {/* 이미지 */}
              <img
                src={src}
                alt={`게시글 이미지 ${index + 1}`}
                className="h-full w-full object-cover"
              />

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
