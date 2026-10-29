import { useState } from "react";
import { DotPulse } from "ldrs/react";
import "ldrs/react/DotPulse.css";

// 로딩 이미지 자동 불러오기
const modules = import.meta.glob("@/assets/loading/*.{png,webp,svg}", {
  eager: true,
  query: "?url",
  import: "default",
});

const LOADING_IMAGES = Object.values(modules) as string[];

// 이미지 개수
const LOADING_IMAGE_COUNT = LOADING_IMAGES.length;

export default function LoadingPage() {
  // 컴포넌트가 생성될 때 랜덤 이미지 선택
  const [image] = useState(() => {
    const index = Math.floor(Math.random() * LOADING_IMAGE_COUNT);
    return LOADING_IMAGES[index];
  });

  return (
    <div className="flex min-h-dvh items-center justify-center">
      <div className="mb-20 flex flex-col items-center gap-6">
        {image && (
          <img src={image} alt="로딩 중" className="size-40 object-contain" />
        )}

        <DotPulse size={40} speed={1.3} color="var(--primary)" />
      </div>
    </div>
  );
}
