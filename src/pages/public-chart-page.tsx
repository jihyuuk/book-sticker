import { useParams } from "react-router";
import { usePublicChartData } from "@/hooks/queries/use-public-chart-data";
import GlobalLoading from "@/components/global-loading";
import GlobalError from "@/components/global-error";
import HeaderImage from "@/components/header-image";
import ChartList from "@/components/chart/chart-list";
import FooterImage from "@/components/footer-image";
import PublicNotFound from "@/components/Public-not-fount";
import { usePreloadImages } from "@/hooks/use-preload-images";

export default function PublicChartPage() {
  const { publicId } = useParams();

  const {
    data: publicChartData,
    isPending,
    isError,
  } = usePublicChartData(publicId);

  // 이미지 로딩 완료 여부
  const isImagesLoaded = usePreloadImages();

  if (isPending || !isImagesLoaded) return <GlobalLoading />;
  if (isError) return <GlobalError />;

  //is_public = false면 발동 || 존재하지 않는 publicId
  //선생님이 공개 여부 설정가능
  //나중에 만들거라 일단 기본값 true
  if (!publicChartData) {
    return <PublicNotFound />;
  }

  return (
    <div className="flex h-dvh flex-col">
      <HeaderImage />
      <ChartList kids={publicChartData.kids} />
      <FooterImage />
    </div>
  );
}
