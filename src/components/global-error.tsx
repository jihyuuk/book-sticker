import { CircleAlert } from "lucide-react";

export default function GlobalError() {
  return (
    <div className="flex h-dvh items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-center">
        <CircleAlert className="size-9 text-red-500" />

        <div>
          <p className="font-semibold text-gray-800">문제가 발생했습니다</p>

          <p className="mt-1 text-sm text-gray-500">
            잠시 후 다시 시도해주세요.
          </p>
        </div>
      </div>
    </div>
  );
}
