import { useEffect, useRef } from "react";
import { useLocation } from "react-router";
import { useClearPostEditSession } from "@/store/post-edit-session-store";

// 게시글 수정 페이지 경로
const EDIT_PATH = /^\/classroom\/[^/]+\/posts\/[^/]+\/edit\/?$/;

export default function PostEditSessionGuard() {
  const { pathname } = useLocation();
  const previousPathRef = useRef(pathname);
  const clearSession = useClearPostEditSession();

  // 수정 페이지를 벗어나면 비밀번호 삭제
  useEffect(() => {
    const previousPath = previousPathRef.current;

    if (EDIT_PATH.test(previousPath) && previousPath !== pathname) {
      clearSession();
    }

    previousPathRef.current = pathname;
  }, [pathname, clearSession]);

  // 브라우저 이탈 및 새로고침
  useEffect(() => {
    const handlePageHide = () => {
      clearSession();
    };

    window.addEventListener("pagehide", handlePageHide);

    return () => {
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, [clearSession]);

  return null;
}
