import { INFO_HEIGHT } from "@/lib/constants";
import type { Kid } from "@/types";
import stickerImage from "@/assets/sticker.png";

type Props = {
  kid: Kid;
  stickerGap: number;
  background: string;
};

export default function ChartItem({ kid, stickerGap, background }: Props) {
  return (
    <section className="h-full w-20 shrink-0 overflow-hidden rounded-xl bg-[rgb(254,247,233)] shadow-sm">
      <div
        className="relative flex h-full w-full flex-col"
        style={{ background }}
      >
        {/* 스티커 영역 */}
        <div className="relative min-h-0 w-full flex-1">
          {Array.from({ length: kid.bookCount }).map((_, stickerIndex) => (
            <img
              key={stickerIndex}
              src={stickerImage}
              className="absolute left-1/2 size-10 -translate-x-1/2 object-contain"
              style={{
                bottom: stickerIndex * stickerGap,
              }}
            />
          ))}
        </div>

        {/* 정보 영역 */}
        <div
          className="flex shrink-0 flex-col items-center justify-center"
          style={{ height: INFO_HEIGHT }}
        >
          <p className="text-lg font-semibold">{kid.name}</p>
          <p className="text-sm font-medium text-stone-600">
            {kid.bookCount}권
          </p>
        </div>
      </div>
    </section>
  );
}
