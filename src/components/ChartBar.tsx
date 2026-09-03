import { INFO_HEIGHT } from "@/lib/constants";
import type { Kid } from "@/types";

type Props = {
  kid: Kid;
  stickerAreaHeight: number;
  stickerGap: number;
  backgroundColor: string;
};

export default function ChartBar({
  kid,
  stickerAreaHeight,
  stickerGap,
  backgroundColor,
}: Props) {
  return (
    <div className="flex w-18 shrink-0 flex-col items-center overflow-hidden rounded-2xl bg-[rgb(254,247,233)] shadow-sm md:w-20">
      <div
        className="relative h-full w-full"
        style={{
          background: backgroundColor,
        }}
      >
        {/* 스티커 영역 */}
        <div
          className="relative mx-auto w-full"
          style={{ height: stickerAreaHeight }}
        >
          {Array.from({ length: kid.bookCount }).map((_, stickerIndex) => (
            <img
              key={stickerIndex}
              src="/sticker.png"
              alt=""
              className="absolute left-1/2 size-10 -translate-x-1/2 object-contain"
              style={{
                bottom: stickerIndex * stickerGap,
              }}
            />
          ))}
        </div>

        {/* 정보 영역 */}
        <div
          className="flex flex-col items-center justify-center"
          style={{ height: INFO_HEIGHT }}
        >
          <p className="text-base font-semibold md:text-lg">{kid.name}</p>
          <p className="text-sm font-medium text-stone-600">
            {kid.bookCount}권
          </p>
        </div>
      </div>
    </div>
  );
}
