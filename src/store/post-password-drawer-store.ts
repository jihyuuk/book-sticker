import type { PublicPost } from "@/types/dto/public-dto";
import { create } from "zustand";
import { combine, devtools } from "zustand/middleware";

export type PostActionType = "EDIT" | "DELETE";

type OpenState = {
  isOpen: true;
  type: PostActionType;
  post: PublicPost;
  publicId: string;
};

type CloseState = {
  isOpen: false;
  type?: PostActionType;
  post?: PublicPost;
  publicId?: string;
};

type State = CloseState | OpenState;

const initialState = {
  isOpen: false,
} as State;

const usePostPasswordDrawerStore = create(
  devtools(
    combine(initialState, (set) => ({
      actions: {
        open: (params: Omit<OpenState, "isOpen">) => {
          set({
            ...params,
            isOpen: true,
          });
        },
        close: () => {
          set({ isOpen: false });
        },
      },
    })),
    { name: "PostPasswordDrawerStore" },
  ),
);

export const useOpenPostPasswordDrawer = () => {
  return usePostPasswordDrawerStore((store) => store.actions.open);
};

export const useClosePostPasswordDrawer = () => {
  return usePostPasswordDrawerStore((store) => store.actions.close);
};

export const usePostPasswordDrawer = () => {
  const store = usePostPasswordDrawerStore();
  return store as typeof store & State;
};
