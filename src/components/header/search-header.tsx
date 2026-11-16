import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import ClearableInput from "../ui/clearable-input";
import { useEffect, useRef } from "react";

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

  // 페이지 진입 시 자동 포커스
  useEffect(() => {
    focusInput();
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
