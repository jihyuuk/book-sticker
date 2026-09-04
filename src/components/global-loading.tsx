import { LoaderCircle } from "lucide-react";
import loadingImage from "@/assets/bear-min.webp?inline";

export default function GlobalLoading() {
  return (
    <div className="flex h-dvh items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <img src={loadingImage} className="w-55 object-contain md:w-65" />

        <div className="flex items-center gap-2">
          <p className="font-medium text-gray-500">불러오는 중...</p>
          <LoaderCircle className="size-4 animate-spin text-gray-500" />
        </div>
      </div>
    </div>
  );
}
