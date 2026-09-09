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
      <div className="overflow-hidden rounded-2xl">
        <img
          src={images[0]}
          alt=""
          className="max-h-[500px] w-full object-contain"
        />
      </div>
    );
  }

  return (
    <div>
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent>
          {images.map((src, index) => (
            <CarouselItem key={index}>
              <div className="overflow-hidden rounded-2xl bg-gray-100">
                <img
                  src={src}
                  alt={`게시글 이미지 ${index + 1}`}
                  className="h-[360px] w-full object-contain md:h-[480px]"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="left-3" />
        <CarouselNext className="right-3" />
      </Carousel>

      {/* 인디케이터 */}
      <div className="mt-3 flex justify-center gap-1.5">
        {images.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => api?.scrollTo(index)}
            className={`size-2 rounded-full transition-colors ${
              current === index ? "bg-gray-700" : "bg-gray-300"
            }`}
            aria-label={`${index + 1}번째 이미지`}
          />
        ))}
      </div>
    </div>
  );
}
