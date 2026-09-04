import type { Kid } from "@/types";
import { create } from "zustand";
import { combine, devtools } from "zustand/middleware";

type OpenState = {
  isOpen: true;
  kid: Kid;
};

type CloseState = {
  isOpen: false;
};

type State = OpenState | CloseState;

const initialState = {
  isOpen: false,
} as State;

const useUpdateKidModalStore = create(
  devtools(
    combine(initialState, (set) => ({
      actions: {
        open: (kid: Kid) => {
          set({ isOpen: true, kid });
        },
        close: () => {
          set({ isOpen: false });
        },
      },
    })),
    {
      name: "UpdateKidModalStore",
    },
  ),
);

export const useOpenUpdateKidModal = () => {
  return useUpdateKidModalStore((store) => store.actions.open);
};

export const useUpdateKidModal = () => {
  const store = useUpdateKidModalStore();
  return store as typeof store & State;
};
