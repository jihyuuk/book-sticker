import { useNavigate } from "react-router";
import { Button } from "../ui/button";
import { ClipboardList, Share2 } from "lucide-react";

export default function ChartToolbar() {
  const navigate = useNavigate();

  return (
    <div className="mt-4 flex justify-center gap-2">
      <Button
        className="h-8 items-center gap-1 rounded-lg border border-gray-200 bg-white text-lg font-bold text-gray-700 shadow-[0_4px_0_0_rgba(209,213,219,1)] transition-all hover:bg-gray-50 active:translate-y-1 active:shadow-none"
        onClick={() => navigate("/admin")}
      >
        <Share2 className="size-4" />
        <div className="text-sm font-medium">공유하기</div>
      </Button>

      <Button
        className="h-8 items-center gap-1 rounded-lg border-none bg-sky-400 text-lg font-bold text-white shadow-[0_4px_0_0_rgba(14,165,233,1)] transition-all hover:bg-sky-500 active:translate-y-1 active:shadow-none"
        onClick={() => navigate("/admin")}
      >
        <ClipboardList className="size-4" />
        <div className="text-sm font-medium">기록관리</div>
      </Button>
    </div>
  );
}
