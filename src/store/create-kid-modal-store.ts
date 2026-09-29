import { create } from "zustand";
import { combine, devtools } from "zustand/middleware";

type State = {
  isOpen: boolean;
  classroomId: string | null;
};

const initialState: State = {
  isOpen: false,
  classroomId: null,
};

export const useCreateKidModalStore = create(
  devtools(
    combine(initialState, (set) => ({
      actions: {
        open: (classroomId: string) => {
          set({
            isOpen: true,
            classroomId,
          });
        },

        close: () => {
          set({
            isOpen: false,
            classroomId: null,
          });
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
