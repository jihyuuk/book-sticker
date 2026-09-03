import { INFO_HEIGHT, STICKER_SIZE } from "@/lib/constants";

type Props = {
  chartMaxBookCount: number;
  stickerGap: number;
};

export default function ChartScaleLine({
  chartMaxBookCount,
  stickerGap,
}: Props) {
  //차트 눈금
  const gridStep = chartMaxBookCount > 100 ? 20 : 10;

  const gridValues = Array.from(
    { length: Math.floor(chartMaxBookCount / gridStep) },
    (_, index) => (index + 1) * gridStep,
  );

  return (
    <>
      {gridValues.map((value) => (
        <div
          key={value}
          className="pointer-events-none absolute right-0 left-0 z-20 flex translate-y-1/2 items-center gap-1 px-4"
          style={{
            bottom: INFO_HEIGHT + (value - 1) * stickerGap + STICKER_SIZE / 2,
          }}
        >
          <span className="text-xs leading-none text-black">{value}</span>

          <div className="flex-1 border-t border-dashed border-black/20" />
        </div>
      ))}
    </>
  );
}
