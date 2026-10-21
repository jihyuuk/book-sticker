import { create } from "zustand";
import { combine, devtools } from "zustand/middleware";

type State = {
  isOpen: boolean;
  images: string[];
  initialIndex: number;
};

type OpenParams = {
  images: string[];
  initialIndex?: number;
};

const initialState: State = {
  isOpen: false,
  images: [],
  initialIndex: 0,
};

const useImageViewerStore = create(
  devtools(
    combine(initialState, (set) => ({
      actions: {
        open: ({ images, initialIndex = 0 }: OpenParams) => {
          if (images.length === 0) return;

          set({
            isOpen: true,
            images,
            initialIndex: Math.max(
              0,
              Math.min(initialIndex, images.length - 1),
            ),
          });
        },
        close: () => {
          set({ isOpen: false });
        },
      },
    })),
    { name: "ImageViewerStore" },
  ),
);

export const useOpenImageViewer = () => {
  return useImageViewerStore((store) => store.actions.open);
};

export const useImageViewer = () => {
  return useImageViewerStore();
};
