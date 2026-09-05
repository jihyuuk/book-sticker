export default function PublicNotFound() {
  return (
    <div className="flex min-h-dvh items-center justify-center px-6">
      {/* 카드 영역 */}
      <div className="w-full max-w-md rounded-3xl bg-white p-10 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:p-12">
        {/* 아이콘 */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-50">
          <svg
            className="h-10 w-10 text-amber-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        {/* 타이틀 */}
        <h1 className="mt-6 text-2xl font-bold tracking-tight text-gray-900">
          페이지를 찾을 수 없습니다
        </h1>

        {/* 설명 텍스트 */}
        <p className="mt-4 text-base leading-7 text-gray-500">
          입력하신 링크가 올바르지 않거나,
          <br />
          현재 공개되지 않은 주소입니다.
        </p>
      </div>
    </div>
  );
}
