import { preloadImages } from "@/lib/chart-images";
import { useEffect, useState } from "react";

export function usePreloadImages() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadImages = async () => {
      await Promise.all(
        preloadImages.map(async (src) => {
          const image = new Image();
          image.src = src;

          try {
            await image.decode();
          } catch {
            // 이미지 하나 실패해도 전체 로딩이 멈추지 않도록
          }
        }),
      );

      setIsLoaded(true);
    };

    loadImages();
  }, []);

  return isLoaded;
}
