import { createPortal } from "react-dom";

type Props2 = {
  onClose: () => void;
};

// radix 에러 임시 꼼수
// https://github.com/RublerubitZ/duing/issues/1331?utm_source=chatgpt.com
export default function DropdownMenuBackdrop({ onClose }: Props2) {
  return createPortal(
    <div
      aria-hidden="true"
      className="pointer-events-auto fixed inset-0 z-40 bg-transparent"
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    />,
    document.body,
  );
}
