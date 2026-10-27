import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { Input } from "@/components/ui/input";

type PasswordInputProps = Omit<
  React.ComponentProps<typeof Input>,
  "type" | "endIcon"
>;

export default function PasswordInput({ value, ...props }: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false);

  const hasValue = String(value ?? "").length > 0;

  return (
    <Input
      {...props}
      value={value}
      type={isVisible ? "text" : "password"}
      endIcon={
        hasValue ? (
          <button
            type="button"
            tabIndex={-1}
            className="pl-1.5"
            aria-label={isVisible ? "비밀번호 숨기기" : "비밀번호 보기"}
            onPointerDown={(e) => e.preventDefault()}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setIsVisible((prev) => !prev)}
          >
            {isVisible ? <Eye /> : <EyeOff />}
          </button>
        ) : undefined
      }
    />
  );
}
