import { useRef } from "react";
import { createPortal } from "react-dom";

type Props = {
  onClose: () => void;
};

export default function DropdownMenuBackdrop({ onClose }: Props) {
  const pointerStartedRef = useRef(false);

  return createPortal(
    <div
      aria-hidden="true"
      className="pointer-events-auto fixed inset-0 z-40 bg-transparent"
      onPointerDown={(event) => {
        event.stopPropagation();
        pointerStartedRef.current = true;
      }}
      onPointerCancel={() => {
        pointerStartedRef.current = false;
      }}
      onClick={(event) => {
        event.stopPropagation();

        // Backdrop에서 시작된 터치만 닫기
        if (!pointerStartedRef.current) return;

        pointerStartedRef.current = false;
        onClose();
      }}
    />,
    document.body,
  );
}
