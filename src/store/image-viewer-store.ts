import { create } from "zustand";
import { combine, devtools } from "zustand/middleware";
import type { PostMedia } from "@/types/post-media";

type State = {
  isOpen: boolean;
  media: PostMedia[];
  initialIndex: number;
};

type OpenParams =
  | { media: PostMedia[]; initialIndex?: number }
  | { images: string[]; initialIndex?: number };

const initialState: State = {
  isOpen: false,
  media: [],
  initialIndex: 0,
};

const useImageViewerStore = create(
  devtools(
    combine(initialState, (set) => ({
      actions: {
        open: (params: OpenParams) => {
          const media: PostMedia[] =
            "media" in params
              ? params.media
              : params.images.map((url, index) => ({
                  id: `image-${index}`,
                  type: "IMAGE" as const,
                  url,
                }));

          if (media.length === 0) return;

          set({
            isOpen: true,
            media,
            initialIndex: Math.max(
              0,
              Math.min(params.initialIndex ?? 0, media.length - 1),
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

export const useOpenMediaViewer = () => {
  return useImageViewerStore((store) => store.actions.open);
};

// 기존 사용처 호환
export const useOpenImageViewer = useOpenMediaViewer;

export const useImageViewer = () => {
  return useImageViewerStore();
};
