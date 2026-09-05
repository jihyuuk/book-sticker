import { Button } from "@/components/ui/button";
import { useClassroom } from "@/hooks/queries/use-classroom";
import { useKids } from "@/hooks/queries/use-kids";
import { useOpenCreateKidModal } from "@/store/create-kid-modal-store";
import { useOpenUpdateKidModal } from "@/store/update-kid-modal";
import {
  BookOpen,
  Plus,
  User,
  ChevronRight,
  ChartColumnIncreasing,
} from "lucide-react";
import { useNavigate } from "react-router";

export default function AdminPage() {
  const { data: classroom } = useClassroom();
  const { data: kids } = useKids(classroom?.id);

  const navigate = useNavigate();
  const openCreateKidModal = useOpenCreateKidModal();
  const openUpdateKidModal = useOpenUpdateKidModal();

  return (
    <div className="min-h-dvh bg-slate-50/60 p-4 sm:p-6 md:p-8">
      <div className="mx-auto max-w-3xl space-y-4 sm:space-y-6">
        {/* 헤더 영역 */}
        <div className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-indigo-100 bg-indigo-50 text-indigo-600">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 sm:text-2xl">
                햇살반 독서 관리
              </h1>
              <div className="mt-0.5 flex items-center gap-1.5 text-xs font-semibold text-indigo-600">
                <ChartColumnIncreasing className="h-3.5 w-3.5" />
                <span
                  className="cursor-pointer underline"
                  onClick={() => navigate("/")}
                >
                  독서 차트 보기
                </span>
              </div>
            </div>
          </div>

          <Button
            onClick={openCreateKidModal}
            className="flex h-11 w-full items-center justify-center gap-1.5 rounded-2xl border-none bg-sky-400 px-5 font-bold text-white shadow-[0_4px_0_0_rgba(14,165,233,1)] transition-all hover:bg-sky-500 active:translate-y-1 active:shadow-none sm:w-auto"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            어린이 추가
          </Button>
        </div>

        {/* 아이들 목록 영역 */}
        <div className="space-y-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="flex items-center gap-2 text-base font-bold text-slate-800 sm:text-lg">
              아이들 목록
              <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-600">
                총 {kids?.length || 0}명
              </span>
            </h2>
          </div>

          {/* 목록 grid */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {kids?.map((kid) => (
              <div
                key={kid.id}
                onClick={() => openUpdateKidModal(kid)}
                className="group flex cursor-pointer items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 transition-all hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-white hover:shadow-md sm:p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors group-hover:border-indigo-100 group-hover:bg-indigo-50 group-hover:text-indigo-600">
                    <User className="h-5 w-5" />
                  </div>
                  <p className="truncate font-bold text-slate-800 transition-colors group-hover:text-indigo-600">
                    {kid.name}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <div className="rounded-lg border border-indigo-100/50 bg-indigo-50 px-3 py-1 text-sm font-bold text-indigo-700">
                    {kid.book_count}{" "}
                    <span className="text-xs font-normal text-indigo-600">
                      권
                    </span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:text-indigo-400" />
                </div>
              </div>
            ))}

            {/* 데이터가 없을 때 */}
            {(!kids || kids.length === 0) && (
              <div className="col-span-full py-10 text-center text-sm text-slate-400 sm:py-12">
                등록된 어린이 정보가 없습니다. 상단의 '어린이 추가' 버튼을
                눌러주세요.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
