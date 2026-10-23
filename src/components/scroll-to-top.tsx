import { useLayoutEffect } from "react";
import { useLocation, useNavigationType } from "react-router";
import { consumeScrollReset } from "@/lib/scroll";

export default function ScrollToTop() {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();

  useLayoutEffect(() => {
    // 강제 초기화 요청 확인
    if (consumeScrollReset()) {
      if (window.scrollY !== 0) {
        window.scrollTo(0, 0);
      }

      const frameId = requestAnimationFrame(() => {
        if (window.scrollY !== 0) {
          window.scrollTo(0, 0);
        }
      });

      return () => cancelAnimationFrame(frameId);
    }

    // 뒤로가기 / 앞으로가기는 브라우저에 맡김
    if (navigationType === "POP") return;

    // 일반 페이지 이동 시 초기화
    window.scrollTo(0, 0);
  }, [pathname, navigationType]);

  return null;
}
