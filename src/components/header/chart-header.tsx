import { Check, ChevronLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";

type Props = {
  title: string;
  classrooms?: {
    id: string;
    name: string | null;
  }[];
  selectedClassroomId?: string | null;
  onClassroomChange?: (classroomId: string) => void;
};

export default function ChartHeader({
  title,
  classrooms = [],
  selectedClassroomId,
  onClassroomChange,
}: Props) {
  const navigate = useNavigate();
  const { publicId } = useParams();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // 선택된 반이 없으면 자동으로 Drawer 열기
  // useEffect(() => {
  //   if (!publicId && selectedClassroomId === null) {
  //     setIsDrawerOpen(true);
  //   }
  // }, [publicId, selectedClassroomId]);

  const handleBack = () => {
    const canGoBack = (window.history.state?.idx ?? 0) > 0;

    if (canGoBack) {
      navigate(-1);
      return;
    }

    const fallbackPath = publicId ? `/classroom/${publicId}/posts` : "/";

    navigate(fallbackPath, { replace: true });
  };

  const handleSelectClassroom = (classroomId: string) => {
    onClassroomChange?.(classroomId);
    setIsDrawerOpen(false);
  };

  return (
    <header className="flex h-20 shrink-0 items-center justify-center md:h-22">
      <div className="px-page-x grid w-full max-w-4xl grid-cols-[64px_minmax(0,1fr)_64px] items-center">
        <button
          type="button"
          onClick={handleBack}
          aria-label="뒤로가기"
          className="justify-self-start"
        >
          <ChevronLeft className="size-6" strokeWidth={1.5} />
        </button>

        <div className="text-title-2 min-w-0 truncate px-2 text-center font-semibold">
          {title} 독서판
        </div>

        {!publicId && onClassroomChange ? (
          <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <DrawerTrigger asChild>
              <button
                type="button"
                className="justify-self-end text-sm font-medium whitespace-nowrap text-sky-600"
              >
                반 변경
              </button>
            </DrawerTrigger>

            <DrawerContent className="overflow-hidden">
              <div className="max-h-[70dvh] min-h-[25dvh] shrink-0 overflow-y-auto overscroll-contain px-4 pb-6">
                {classrooms.length === 0 ? (
                  <p className="text-muted-foreground py-10 text-center text-sm">
                    등록된 반이 없습니다.
                  </p>
                ) : (
                  classrooms.map((classroom) => (
                    <button
                      key={classroom.id}
                      type="button"
                      onClick={() => handleSelectClassroom(classroom.id)}
                      className="flex h-14 w-full items-center justify-between border-b text-left last:border-b-0"
                    >
                      <span className="text-sm font-medium">
                        {classroom.name ?? "이름 없는 반"}
                      </span>

                      {selectedClassroomId === classroom.id && (
                        <Check className="size-4 text-sky-600" />
                      )}
                    </button>
                  ))
                )}
              </div>
            </DrawerContent>
          </Drawer>
        ) : (
          <div />
        )}
      </div>
    </header>
  );
}
