import { SCROLL_RESET_KEY } from "./constants";

//스크롤 초기화 요청
export function requestScrollReset() {
  sessionStorage.setItem(SCROLL_RESET_KEY, "true");
}

// 요청 확인 및 제거d
export function consumeScrollReset() {
  const shouldReset = sessionStorage.getItem(SCROLL_RESET_KEY) === "true";

  sessionStorage.removeItem(SCROLL_RESET_KEY);

  return shouldReset;
}
