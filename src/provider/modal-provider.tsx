import AlertModal from "@/components/modal/alert-modal";
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
          <AlertModal />
        </>,
        document.getElementById("modal-root")!,
      )}
      {children}
    </>
  );
}
