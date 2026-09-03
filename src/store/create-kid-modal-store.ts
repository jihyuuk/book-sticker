import { create } from "zustand";
import { combine, devtools } from "zustand/middleware";

type State = {
  isOpen: boolean;
};

const initialState = {
  isOpen: false,
} as State;

export const useCreateKidModalStore = create(
  devtools(
    combine(initialState, (set) => ({
      actions: {
        open: () => {
          set({ isOpen: true });
        },
        close: () => {
          set({ isOpen: false });
        },
      },
    })),
    {
      name: "CreateKidModalStore",
    },
  ),
);

export const useOpenCreateKidModal = () => {
  return useCreateKidModalStore((store) => store.actions.open);
};
