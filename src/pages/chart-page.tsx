import ChartList from "@/components/chart/chart-list";
import FooterImage from "@/components/chart/footer-image";
import GlobalError from "@/components/global-error";
import GlobalLoading from "@/components/global-loading";
import { usePreloadImages } from "@/hooks/utils/use-preload-images";
import ChartHeader from "@/components/header/chart-header";
import { useAdminChart } from "@/hooks/queries/use-admin-chart";
import NotFoundPage from "./not-found-page";
import { useEffect, useState } from "react";
import { SELECTED_CHART_CLASSROOM_KEY } from "@/lib/constants";
import { useClassrooms } from "@/hooks/queries/use-classrooms";

export default function ChartPage() {
  const [selectedClassroomId, setSelectedClassroomId] = useState<
    string | null | undefined
  >(undefined);

  // 1. 반 목록 조회
  const {
    data: classrooms,
    isPending: isClassroomsPending,
    isError: isClassroomsError,
    isSuccess: isClassroomsSuccess,
  } = useClassrooms();

  // 2. 저장된 반 ID 검증
  useEffect(() => {
    if (!isClassroomsSuccess) return;

    const storedId = localStorage.getItem(SELECTED_CHART_CLASSROOM_KEY);

    const isValid = classrooms.some((classroom) => classroom.id === storedId);

    if (!isValid) {
      localStorage.removeItem(SELECTED_CHART_CLASSROOM_KEY);
    }

    setSelectedClassroomId(isValid ? storedId : null);
  }, [classrooms, isClassroomsSuccess]);

  // 3. 반 변경
  const handleClassroomChange = (classroomId: string) => {
    localStorage.setItem(SELECTED_CHART_CLASSROOM_KEY, classroomId);
    setSelectedClassroomId(classroomId);
  };

  // 4. 차트 조회
  const {
    data,
    isPending: isChartPending,
    isError: isChartError,
  } = useAdminChart(selectedClassroomId ?? undefined);

  const isImagesLoaded = usePreloadImages();

  if (isClassroomsError || isChartError) {
    return <GlobalError />;
  }

  if (
    isClassroomsPending ||
    selectedClassroomId === undefined ||
    (selectedClassroomId !== null && (isChartPending || !isImagesLoaded))
  ) {
    return <GlobalLoading />;
  }

  if (selectedClassroomId && !data) {
    return <NotFoundPage />;
  }

  const title = data?.classroom.name ? data.classroom.name : "독서판";

  return (
    <div className="flex h-dvh flex-col">
      <ChartHeader
        title={title}
        classrooms={classrooms ?? []}
        selectedClassroomId={selectedClassroomId}
        onClassroomChange={handleClassroomChange}
      />

      {selectedClassroomId && data ? (
        <ChartList key={selectedClassroomId} kids={data.chartKids} />
      ) : (
        <div className="mb-20 flex flex-1 items-center justify-center">
          <p className="text-muted-foreground">반을 선택해 주세요.</p>
        </div>
      )}

      <FooterImage />
    </div>
  );
}
