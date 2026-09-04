import ChartList from "@/components/chart/chart-list";
import FooterImage from "@/components/footer-image";
import GlobalError from "@/components/global-error";
import GlobalLoading from "@/components/global-loading";
import HeaderImage from "@/components/header-image";
import { useKids } from "@/hooks/queries/use-kids";

export default function ChartPage() {
  const { data: kids = [], isPending, isError } = useKids();

  //로딩,에러 처리
  if (isPending) return <GlobalLoading />;
  if (isError) return <GlobalError />;

  return (
    <div className="flex h-dvh flex-col">
      {/* 헤더 이미지 */}
      <HeaderImage />

      {/* 차트 영역 */}
      <ChartList kids={kids} />

      {/* 푸터 이미지 */}
      <FooterImage />
    </div>
  );
}
