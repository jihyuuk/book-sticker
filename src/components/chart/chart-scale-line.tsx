import { INFO_HEIGHT, STICKER_SIZE } from "@/lib/constants";

type Props = {
  scaleValues: number[];
  stickerGap: number;
};

export default function ChartScaleLine({ scaleValues, stickerGap }: Props) {
  return (
    <>
      {scaleValues.map((value) => {
        //위치(높이) 계산
        const bottom =
          INFO_HEIGHT + (value - 1) * stickerGap + STICKER_SIZE / 2;

        return (
          <div
            key={value}
            className="pointer-events-none absolute right-0 left-0 z-20 flex translate-y-1/2 items-center gap-1"
            style={{ bottom }}
          >
            <span className="text-xs leading-none text-black">{value}</span>

            <div className="flex-1 border-t border-dashed border-black/20" />
          </div>
        );
      })}
    </>
  );
}
