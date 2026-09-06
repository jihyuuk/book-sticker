import ChartList from "@/components/chart/chart-list";
import ChartToolbar from "@/components/chart/chart-toolbar";
import FooterImage from "@/components/footer-image";
import GlobalError from "@/components/global-error";
import GlobalLoading from "@/components/global-loading";
import HeaderImage from "@/components/header-image";
import { useClassroom } from "@/hooks/queries/use-classroom";
import { useKids } from "@/hooks/queries/use-kids";
import { useBookImagesLoaded } from "@/hooks/use-book-images-loaded";

export default function ChartPage() {
  // 1. classroom 조회
  const {
    data: classroom,
    isPending: isClassroomPending,
    isError: isClassroomError,
  } = useClassroom();

  // 2. classroom을 기반으로 kids 조회
  const {
    data: kids = [],
    isPending: isKidsPending,
    error: isKidsError,
  } = useKids(classroom?.id);

  //책 이미지 로딩 완료 여부
  const isBookImagesLoaded = useBookImagesLoaded();

  //로딩 처리
  if (isClassroomPending || isKidsPending || !isBookImagesLoaded) {
    return <GlobalLoading />;
  }

  //에러 처리
  if (isClassroomError || isKidsError) return <GlobalError />;

  return (
    <div className="flex h-dvh flex-col">
      {/* 헤더 이미지 */}
      <HeaderImage />

      {/* 툴바 */}
      <ChartToolbar />

      {/* 차트 영역 */}
      <ChartList kids={kids} />

      {/* 푸터 이미지 */}
      <FooterImage />
    </div>
  );
}
