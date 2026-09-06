import KidListItem from "@/components/admin/kid-list-item";
import { Button } from "@/components/ui/button";
import { useClassroom } from "@/hooks/queries/use-classroom";
import { useKids } from "@/hooks/queries/use-kids";
import { useOpenCreateKidModal } from "@/store/create-kid-modal-store";
import { Plus, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router";

export default function AdminPage() {
  const { data: classroom } = useClassroom();
  const { data: kids } = useKids(classroom?.id);

  const navigate = useNavigate();
  const openCreateKidModal = useOpenCreateKidModal();

  return (
    <div className="min-h-dvh">
      <header className="bg-white shadow-sm">
        <div className="mx-auto flex h-16 w-full max-w-3xl items-center justify-between px-5">
          <div className="flex items-center gap-2">
            <ChevronLeft
              className="size-7 cursor-pointer"
              strokeWidth={1.5}
              onClick={() => navigate(-1)}
            />

            <h1 className="cursor-default text-xl font-semibold">기록 관리</h1>
          </div>

          <Button
            onClick={openCreateKidModal}
            className="flex h-9 items-center gap-1 rounded-xl border-none bg-sky-400 text-lg font-bold text-white shadow-[0_4px_0_0_rgba(14,165,233,1)] transition-all hover:bg-sky-500 active:translate-y-1 active:shadow-none"
          >
            <Plus className="size-5" />
            <span className="text-sm font-semibold">어린이 추가</span>
          </Button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl px-5 pt-5">
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
          {kids?.map((kid) => (
            <KidListItem key={kid.id} kid={kid} />
          ))}
        </div>
      </main>
    </div>
  );
}
