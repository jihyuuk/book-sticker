import PostPasswordDrawer from "@/components/drawers/post-password-drawer";
import LoadingOverlay from "@/components/loading-overlay";
import AlertModal from "@/components/modal/alert-modal";
import ImageViewer from "@/components/modal/image-viewer";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";

export default function ModalProvider({ children }: { children: ReactNode }) {
  return (
    <>
      {createPortal(
        <>
          <AlertModal />
          <ImageViewer />
          <PostPasswordDrawer />
          <LoadingOverlay />
        </>,
        document.getElementById("modal-root")!,
      )}
      {children}
    </>
  );
}
