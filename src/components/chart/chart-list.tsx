import ChartScaleLine from "./chart-scale-line";
import ChartItem from "./chart-item";
import {
  getChartScale,
  getRainbowBackground,
  getStickerGap,
} from "@/lib/utils";
import { useChartHeight } from "@/hooks/use-chart-height";
import type { Kid } from "@/types";
import { useDragScroll } from "@/hooks/use-drag-scroll";

type Props = {
  kids: Kid[];
};

export default function ChartList({ kids }: Props) {
  //차트 동적 높이 측정
  const { chartRef, chartHeight } = useChartHeight();
  const dragScroll = useDragScroll();

  //차트의 최대 권 수
  const kidMaxBookCount = Math.max(...kids.map((kid) => kid.bookCount), 0); //현재 아이들 중 최대 권 수
  const { chartMaxBookCount, scaleValues } = getChartScale(kidMaxBookCount);

  //스티커 갭
  const stickerGap = getStickerGap(chartMaxBookCount, chartHeight);

  if (kids.length <= 0) return null;

  return (
    <div
      ref={chartRef}
      {...dragScroll}
      className="z-10 mt-4 min-h-0 flex-1 cursor-grab overflow-x-auto px-2 py-4 active:cursor-grabbing"
    >
      {/* 차트 */}
      <div className="relative mx-auto flex h-full w-max gap-3 pr-2 pl-6">
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
