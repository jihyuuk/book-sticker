import AlertModal from "@/components/modal/alert-modal";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";

export default function ModalProvider({ children }: { children: ReactNode }) {
  return (
    <>
      {createPortal(
        <>
          <AlertModal />
        </>,
        document.getElementById("modal-root")!,
      )}
      {children}
    </>
  );
}
