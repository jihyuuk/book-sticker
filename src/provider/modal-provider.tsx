import CreateKidModal from "@/components/modal/create-kid-modal";
import UpdateKidModal from "@/components/modal/update-kid-modal";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";

export default function ModalProvider({ children }: { children: ReactNode }) {
  return (
    <>
      {createPortal(
        <>
          <CreateKidModal />
          <UpdateKidModal />
        </>,
        document.getElementById("modal-root")!,
      )}
      {children}
    </>
  );
}
