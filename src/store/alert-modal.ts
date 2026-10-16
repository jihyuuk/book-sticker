import type { ComponentProps } from "react";
import type { Button } from "@/components/ui/button";
import { create } from "zustand";
import { combine, devtools } from "zustand/middleware";

type OpenState = {
  isOpen: true;
  title: string;
  description: string;
  actionLabel?: string;
  actionVariant?: ComponentProps<typeof Button>["variant"];
  onAction?: () => void | Promise<void>;
  onCancel?: () => void;
};

type CloseState = {
  isOpen: false;
};

type State = CloseState | OpenState;

const initialState = {
  isOpen: false,
} as State;

const useAlertModalStore = create(
  devtools(
    combine(initialState, (set) => ({
      actions: {
        open: (params: Omit<OpenState, "isOpen">) => {
          set({
            actionLabel: undefined,
            actionVariant: undefined,
            onAction: undefined,
            onCancel: undefined,
            ...params,
            isOpen: true,
          });
        },
        close: () => {
          set({ isOpen: false });
        },
      },
    })),
    { name: "AlertModalStore" },
  ),
);

export const useOpenAlertModal = () => {
  const open = useAlertModalStore((store) => store.actions.open);
  return open;
};

export const useAlertModal = () => {
  const store = useAlertModalStore();
  return store as typeof store & State;
};
