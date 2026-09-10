import { useEffect, useRef, useState } from "react";
import logo from "/android-chrome-512x512.png";
import IconButtons from "./icon-buttons";

export default function HeaderPostList() {
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
      className={`sticky top-0 z-50 flex h-14 items-center justify-between bg-sky-500 px-6 text-white transition-transform duration-300 md:h-16 ${
        showHeader ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      {/* 로고 영역 */}
      <div className="flex items-center gap-2">
        <img src={logo} alt="북메이트" className="size-8 object-contain" />

        <span className="text-lg font-semibold tracking-wide">북메이트</span>
      </div>
      {/* 아이콘 버튼 영역 */}
      <IconButtons />
    </header>
  );
}
