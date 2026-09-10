import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";

type Props = {
  images: string[];
};

export default function PostImageCarousel({ images }: Props) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    const handleSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    handleSelect();
    api.on("select", handleSelect);

    return () => {
      api.off("select", handleSelect);
    };
  }, [api]);

  if (images.length === 0) return null;

  if (images.length === 1) {
    return (
      <div className="aspect-[4/3] w-full overflow-hidden bg-gray-100">
        <img
          src={images[0]}
          alt="게시글 이미지"
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className="relative">
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent className="ml-0">
          {images.map((src, index) => (
            <CarouselItem key={src} className="pl-0">
              <div className="aspect-[4/3] w-full overflow-hidden bg-gray-100">
                <img
                  src={src}
                  alt={`게시글 이미지 ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="left-3 bg-white/80" />
        <CarouselNext className="right-3 bg-white/80" />
      </Carousel>

      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
        {images.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => api?.scrollTo(index)}
            className={`size-2 rounded-full ${
              current === index ? "bg-white" : "bg-white/50"
            }`}
            aria-label={`${index + 1}번째 이미지`}
          />
        ))}
      </div>
    </div>
  );
}
