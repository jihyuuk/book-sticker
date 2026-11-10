import { Minus, Plus } from "lucide-react";

// 게시글 수 최댓값
const MAX_BOOK_COUNT = 9999;

type Props = {
  id?: string;
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
};

export default function StepperNumberInput({
  id,
  value,
  onValueChange,
  disabled = false,
}: Props) {
  const currentValue = Number(value || 0);

  // 커서를 항상 맨 끝으로 이동
  const moveCaretToEnd = (input: HTMLInputElement) => {
    const end = input.value.length;

    if (input.selectionStart !== end || input.selectionEnd !== end) {
      input.setSelectionRange(end, end);
    }
  };

  // 숫자 증감
  const step = (amount: number) => {
    const next = Math.min(MAX_BOOK_COUNT, Math.max(0, currentValue + amount));

    onValueChange(String(next));
  };

  // 직접 입력
  const handleChange = (input: string) => {
    const digits = input.replace(/\D/g, "");
    const normalized = digits.replace(/^0+(?=\d)/, "");

    // 빈칸 허용
    if (normalized === "") {
      onValueChange("");
      return;
    }

    // 최댓값 초과 시 입력 무시
    if (Number(normalized) > MAX_BOOK_COUNT) {
      return;
    }

    onValueChange(normalized);
  };
  // 포커스 해제 시 빈칸이면 0으로 복원
  const handleBlur = () => {
    if (value === "") {
      onValueChange("0");
    }
  };

  return (
    <div className="flex h-11 items-center overflow-hidden rounded-md border">
      {/* 감소 */}
      <button
        type="button"
        disabled={disabled || currentValue <= 0}
        onClick={() => step(-1)}
        className="flex h-full w-12 shrink-0 items-center justify-center disabled:opacity-30"
        aria-label="1 감소"
      >
        <Minus className="size-4" />
      </button>

      {/* 숫자 입력 */}
      <input
        id={id}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        autoComplete="off"
        value={value}
        disabled={disabled}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={(e) => moveCaretToEnd(e.currentTarget)}
        onClick={(e) => moveCaretToEnd(e.currentTarget)}
        onSelect={(e) => moveCaretToEnd(e.currentTarget)}
        onBlur={handleBlur}
        className="min-w-0 flex-1 self-stretch bg-transparent text-center transition-[background-color,box-shadow] outline-none focus:bg-sky-50 focus:shadow-[inset_0_0_0_1.5px_var(--color-sky-500)]"
        aria-label="게시글 수"
      />

      {/* 증가 */}
      <button
        type="button"
        disabled={disabled || currentValue >= MAX_BOOK_COUNT}
        onClick={() => step(1)}
        className="flex h-full w-12 shrink-0 items-center justify-center disabled:opacity-30"
        aria-label="1 증가"
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}
