import { useParams } from "react-router";
import GlobalLoading from "@/components/global-loading";
import GlobalError from "@/components/global-error";
import ChartList from "@/components/chart/chart-list";
import PublicNotFound from "@/components/Public-not-found";
import { usePreloadImages } from "@/hooks/utils/use-preload-images";
import FooterImage from "@/components/chart/footer-image";
import ChartHeader from "@/components/header/chart-header";
import { usePublicChart } from "@/hooks/queries/use-public-chart";

export default function PublicChartPage() {
  const { publicId } = useParams();

  const { data, isPending, isError } = usePublicChart(publicId);

  // 이미지 로딩 완료 여부
  const isImagesLoaded = usePreloadImages();

  if (isPending || !isImagesLoaded) return <GlobalLoading />;

  if (isError) return <GlobalError />;

  if (!data) {
    return <PublicNotFound />;
  }

  return (
    <div className="flex h-dvh flex-col">
      {/* <HeaderImage /> */}

      {/* 헤더 */}
      <ChartHeader title={data.classroom.name} />

      {/* 차트 영역 */}
      <ChartList kids={data.kids} />

      {/* 하단 이미지 */}
      <FooterImage />
    </div>
  );
}
