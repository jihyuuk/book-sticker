import { useParams } from "react-router";
import { usePublicChartData } from "@/hooks/queries/use-public-chart-data";
import GlobalLoading from "@/components/global-loading";
import GlobalError from "@/components/global-error";
import HeaderImage from "@/components/header-image";
import ChartList from "@/components/chart/chart-list";
import FooterImage from "@/components/footer-image";
import PublicNotFound from "@/components/Public-not-fount";

export default function PublicChartPage() {
  const { publicId } = useParams();

  const { data, isPending, isError } = usePublicChartData(publicId);

  if (isPending) return <GlobalLoading />;
  if (isError) return <GlobalError />;

  //is_public = false면 발동 || 존재하지 않는 publicId
  //선생님이 공개 여부 설정가능
  //나중에 만들거라 일단 기본값 true
  if (!data) {
    return <PublicNotFound />;
  }

  return (
    <div className="flex h-dvh flex-col">
      <HeaderImage />
      <ChartList kids={data.kids} />
      <FooterImage />
    </div>
  );
}
