import { create } from "zustand";
import { combine, devtools } from "zustand/middleware";

type OpenState = {
  isOpen: true;
  message: string;
};

type CloseState = {
  isOpen: false;
};

type State = CloseState | OpenState;

const initialState = {
  isOpen: false,
} as State;

const useLoadingOverlayStore = create(
  devtools(
    combine(initialState, (set) => ({
      actions: {
        open: (message: string) => {
          set({
            isOpen: true,
            message,
          });
        },
        close: () => {
          set({ isOpen: false });
        },
      },
    })),
    { name: "LoadingOverlayStore" },
  ),
);

export const useOpenLoadingOverlay = () => {
  const open = useLoadingOverlayStore((store) => store.actions.open);
  return open;
};

export const useCloseLoadingOverlay = () => {
  const close = useLoadingOverlayStore((store) => store.actions.close);
  return close;
};

export const useLoadingOverlay = () => {
  const store = useLoadingOverlayStore();
  return store as typeof store & State;
};
