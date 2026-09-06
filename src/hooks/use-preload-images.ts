import { preloadImages } from "@/lib/chart-images";
import { useEffect, useState } from "react";

export function usePreloadImages() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    Promise.all(
      preloadImages.map(
        (src) =>
          new Promise<void>((resolve) => {
            const image = new Image();

            image.onload = () => resolve();
            image.onerror = () => resolve();

            image.src = src;
          }),
      ),
    ).then(() => {
      setIsLoaded(true);
    });
  }, []);

  return isLoaded;
}
