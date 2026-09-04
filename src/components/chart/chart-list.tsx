import ChartScaleLine from "./chart-scale-line";
import ChartItem from "./chart-item";
import {
  getChartScale,
  getRainbowBackground,
  getStickerGap,
} from "@/lib/utils";
import { useCharttHeight } from "@/hooks/use-chart-height";
import type { Kid } from "@/types";

type Props = {
  kids: Kid[];
};

export default function ChartList({ kids }: Props) {
  //차트 동적 높이 측정
  const { chartRef, chartHeight } = useCharttHeight();

  //차트의 최대 권 수
  const kidMaxBookCount = Math.max(...kids.map((kid) => kid.bookCount), 0); //현재 아이들 중 최대 권 수
  const { chartMaxBookCount, scaleValues } = getChartScale(kidMaxBookCount);

  //스티커 갭
  const stickerGap = getStickerGap(chartMaxBookCount, chartHeight);

  return (
    <div
      ref={chartRef}
      className="z-10 mt-4 min-h-0 flex-1 overflow-x-auto px-2 py-4"
    >
      {/* 차트 */}
      <div className="relative flex h-full w-max min-w-full gap-3 pl-6">
        {kids.map((kid, index) => (
          <ChartItem
            key={kid.id}
            kid={kid}
            stickerGap={stickerGap}
            background={getRainbowBackground(index, kids.length)}
          />
        ))}

        {/* 차트 눈금 */}
        <ChartScaleLine scaleValues={scaleValues} stickerGap={stickerGap} />
      </div>
    </div>
  );
}
