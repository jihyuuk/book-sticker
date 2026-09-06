import { useNavigate } from "react-router";
import { Button } from "../ui/button";
import { ClipboardList, Share2 } from "lucide-react";
import { toast } from "sonner";
import { useClassroom } from "@/hooks/queries/use-classroom";
import { DOMAIN_URL } from "@/lib/constants";

export default function ChartToolbar() {
  const navigate = useNavigate();
  const classroom = useClassroom();

  const handleSare = async () => {
    if (!classroom) return;

    const url = `${DOMAIN_URL}/share/${classroom!.data?.public_id}`;

    const shareData = {
      title: "우리 반 독서 기록",
      text: "우리 반 독서 기록을 확인해보세요.",
      url,
    };

    try {
      await navigator.clipboard.writeText(url);
      toast.success("공유 링크를 복사했어요.");

      if (
        navigator.share &&
        (!navigator.canShare || navigator.canShare(shareData))
      ) {
        await navigator.share(shareData);
        return;
      }
    } catch (err) {
      console.log("공유 실패:", err);
    }
  };

  return (
    <div className="mt-4 flex justify-center gap-2">
      <Button
        className="h-8 items-center gap-1 rounded-lg border border-gray-200 bg-white text-lg font-bold text-gray-700 shadow-[0_4px_0_0_rgba(209,213,219,1)] transition-all hover:bg-gray-50 active:translate-y-1 active:shadow-none"
        onClick={handleSare}
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
