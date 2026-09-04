import ChartList from "@/components/chart/chart-list";
import FooterImage from "@/components/footer-image";
import HeaderImage from "@/components/header-image";

export default function ChartPage() {
  return (
    <div className="flex h-dvh flex-col">
      {/* 헤더 이미지 */}
      <HeaderImage />

      {/* 차트 영역 */}
      <ChartList />

      {/* 푸터 이미지 */}
      <FooterImage />
    </div>
  );
}
