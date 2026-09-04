import ChartScaleLine from "./chart-scale-line";
import ChartItem from "./chart-item";
import { useEffect, useRef, useState } from "react";
import { useKids } from "@/hooks/queries/use-kids";
import { getRainbowBackground, getStickerGap } from "@/lib/utils";
import { INFO_HEIGHT } from "@/lib/constants";

export default function ChartList() {
  const { data = [] } = useKids();

  //차트 동적 높이 측정
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [chartHeight, setChartHeight] = useState(0);
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const observer = new ResizeObserver(([entry]) => {
      setChartHeight(entry.contentRect.height);
    });

    observer.observe(chartContainerRef.current);

    return () => observer.disconnect();
  }, []);

  //차트의 최대 권 수
  const maxBookCount = Math.max(...data.map((kid) => kid.bookCount), 0); //현재 아이들 중 최대 권 수
  const bookCount = Math.max(20, maxBookCount); // 최솟값은 30권
  const gridStep = bookCount >= 100 ? 20 : 10;
  const chartMaxBookCount =
    Math.floor(bookCount / gridStep) * gridStep + gridStep;

  //스티커 영역 높이
  const stickerAreaHeight = Math.max(chartHeight - INFO_HEIGHT, 0);
  //스티커 갭
  const stickerGap = getStickerGap(chartMaxBookCount, stickerAreaHeight);

  return (
    <div
      ref={chartContainerRef}
      className="z-10 mt-4 mb-15 min-h-0 flex-1 overflow-x-auto"
    >
      {/* 차트 */}
      <div className="relative flex w-max min-w-full gap-3 px-11">
        {data.map((kid, index) => (
          <ChartItem
            key={kid.id}
            kid={kid}
            stickerAreaHeight={stickerAreaHeight}
            stickerGap={stickerGap}
            backgroundColor={getRainbowBackground(index, data.length)}
          />
        ))}

        {/* 차트 눈금 */}
        <ChartScaleLine
          chartMaxBookCount={chartMaxBookCount}
          stickerGap={stickerGap}
        />
      </div>
    </div>
  );
}
