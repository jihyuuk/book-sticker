import { useLoadingOverlay } from "@/store/loading-overlay-store";
import { Hourglass } from "ldrs/react";
import "ldrs/react/Hourglass.css";
import { useEffect } from "react";

export default function LoadingOverlay() {
  const loading = useLoadingOverlay();

  useEffect(() => {
    if (!loading.isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [loading.isOpen]);

  if (!loading.isOpen) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-100 flex touch-none flex-col items-center justify-center gap-4 bg-white/75 backdrop-blur-[2px]"
    >
      <Hourglass size="50" bgOpacity="0.1" speed="1.75" color="#9ca3af" />
      <p className="text-gray-500">{loading.message}</p>
    </div>
  );
}
