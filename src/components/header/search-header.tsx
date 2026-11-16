import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import ClearableInput from "../ui/clearable-input";
import { useEffect, useRef } from "react";
import { isIOS } from "@/lib/is-ios";

type Props = {
  value: string;
  onChangeValue: (value: string) => void;
};

export default function SearchHeader({ value, onChangeValue }: Props) {
  const navigate = useNavigate();
  const { publicId } = useParams();

  const inputRef = useRef<HTMLDivElement>(null);

  const focusInput = () => {
    inputRef.current?.querySelector("input")?.focus();
  };

  // iOS: 임시 Input에서 실제 검색 Input으로 포커스 이전
  useEffect(() => {
    if (!isIOS()) return;

    const temp = document.getElementById("temp-search-input");
    if (!temp) return;

    const input = inputRef.current?.querySelector("input");
    if (!input) return;

    const timer = window.setTimeout(() => {
      // 실제 Input으로 포커스 이전
      input.focus({ preventScroll: true });

      // 포커스 이전에 성공하면 임시 Input 숨김
      if (document.activeElement === input) {
        temp.style.opacity = "0";
        temp.style.pointerEvents = "none";
        temp.setAttribute("aria-hidden", "true");
        temp.tabIndex = -1;
      }
    }, 30);

    return () => window.clearTimeout(timer);
  }, []);

  // 기존 자동 포커스 + 임시 Input 정리
  useEffect(() => {
    const temp = document.getElementById("temp-search-input");

    if (!isIOS() || !temp) {
      focusInput();
    }

    const container = inputRef.current;

    return () => {
      window.setTimeout(() => {
        if (container && !container.isConnected) {
          temp?.remove();
        }
      }, 0);
    };
  }, []);

  const handleBack = () => {
    const canGoBack = (window.history.state?.idx ?? 0) > 0;

    if (canGoBack) {
      navigate(-1);
      return;
    }

    // 이전 히스토리가 없는 경우
    const fallbackPath = publicId ? `/classroom/${publicId}/posts` : "/";

    navigate(fallbackPath, { replace: true });
  };

  return (
    <header className="sticky top-0 z-50 bg-white">
      <div className="mx-auto flex w-full max-w-2xl items-center gap-3 px-4 py-4">
        <button
          className="shrink-0"
          type="button"
          onClick={handleBack}
          aria-label="뒤로가기"
        >
          <ArrowLeft className="size-6" strokeWidth={1.3} />
        </button>

        <div ref={inputRef} className="min-w-0 flex-1">
          <ClearableInput
            size="md"
            className="rounded-full"
            placeholder="검색어를 입력하세요"
            value={value}
            onChange={(e) => onChangeValue(e.target.value)}
            onClear={() => {
              onChangeValue("");
              focusInput();
            }}
          />
        </div>
      </div>
    </header>
  );
}
