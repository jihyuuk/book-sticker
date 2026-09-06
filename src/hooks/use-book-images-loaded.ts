import { bookImages } from "@/lib/random-book";
import { useEffect, useState } from "react";

export function useBookImagesLoaded() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    Promise.all(
      bookImages.map(
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
