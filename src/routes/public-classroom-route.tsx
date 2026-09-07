import GlobalError from "@/components/global-error";
import GlobalLoading from "@/components/global-loading";
import PublicNotFound from "@/components/Public-not-fount";
import { usePublicChartData } from "@/hooks/queries/use-public-chart-data";
import { Outlet, useParams } from "react-router";

export default function PublicClassroomRoute() {
  const { publicId } = useParams();

  const { data, isPending, isError } = usePublicChartData(publicId);

  if (isPending) return <GlobalLoading />;
  if (isError) return <GlobalError />;

  //is_public = false면 발동 || 존재하지 않는 publicId
  //선생님이 공개 여부 설정가능
  //나중에 만들거라 일단 기본값 true
  if (!data) return <PublicNotFound />;

  return <Outlet context={data} />;
}
