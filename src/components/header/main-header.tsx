import { useEffect, useRef, useState } from "react";
import IconButtons from "./icon-buttons";

type Props = {
  isAdmin?: boolean;
};

export default function MainHeader({ isAdmin = false }: Props) {
  const [showHeader, setShowHeader] = useState(true);
  const lastScrollY = useRef(0);

  // 스크롤시 헤더 나타났다 사라졌다
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 10) {
        setShowHeader(true);
      } else if (currentScrollY > lastScrollY.current) {
        setShowHeader(false); // 아래로
      } else {
        setShowHeader(true); // 위로
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`bg-primary sticky top-0 z-50 text-white transition-transform duration-300 ${
        showHeader ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="px-page-x mx-auto flex h-14 w-full max-w-2xl items-center justify-between md:h-16">
        {/* 로고 영역 */}
        <div className="flex items-center gap-2">
          <a href="/">
            <span className="text-title-2 font-semibold tracking-wide">
              북메이트
            </span>
          </a>
          <span className="hidden rounded-full bg-white/30 px-2 py-0.5 text-[10px] font-bold tracking-wider text-white min-[300px]:inline-block">
            BETA
          </span>
        </div>

        {/* 아이콘 버튼 영역 */}
        <IconButtons isAdmin={isAdmin} />
      </div>
    </header>
  );
}
