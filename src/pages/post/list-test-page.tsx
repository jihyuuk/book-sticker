import PostDropdownMenu from "@/components/post/post-dropdwon-menu";
import { useEffect, useRef, useState } from "react";
import { posts } from "./mock-post";
import { ChartColumn, Search } from "lucide-react";
import logo from "/android-chrome-512x512.png";

export default function ListTestPage() {
  const [showHeader, setShowHeader] = useState(true);
  const lastScrollY = useRef(0);

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
    <main className="mx-auto min-h-dvh w-full max-w-2xl bg-gray-100">
      <header
        className={`sticky top-0 z-50 flex h-14 items-center justify-between bg-sky-500 px-6 text-white transition-transform duration-300 md:h-16 ${
          showHeader ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="flex items-center gap-2">
          <img src={logo} alt="북메이트" className="size-8 object-contain" />
          <span className="text-lg font-semibold tracking-wide">북메이트</span>
        </div>
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-full transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            <Search className="size-5" strokeWidth={2} />
          </button>

          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-full transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            <ChartColumn className="size-5" strokeWidth={2} />
          </button>
        </div>
      </header>

      <div className="bg-white px-5 py-5">
        <h1 className="text-xl font-bold tracking-tight text-gray-700">
          2026 햇살반 독서공유장❤
        </h1>

        <p className="mt-1.5 text-sm leading-6 text-gray-500">
          햇살반 친구들의 독서생활을 공유해주세요😊
        </p>
      </div>

      <div className="space-y-8">
        {posts.map((post) => (
          <article key={post.id} className="bg-white pb-5 shadow-sm">
            {/* 헤더 */}
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex min-w-0 items-center gap-3">
                {/* 프로필 이미지 */}
                <div className="size-10 shrink-0 overflow-hidden rounded-full bg-sky-100">
                  {post.profileImage ? (
                    <img
                      src={post.profileImage}
                      alt={`${post.kidName} 프로필`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-sky-600">
                      {post.kidName.slice(0, 1)}
                    </div>
                  )}
                </div>

                {/* 이름 / 작성 시간 */}
                <div className="min-w-0">
                  <p className="truncate text-base font-semibold text-gray-900">
                    {post.kidName}
                  </p>

                  <p className="text-xs text-gray-400">{post.createdAt}</p>
                </div>
              </div>

              <PostDropdownMenu publicId="test" postId={post.id} />
            </div>

            {/* 피드 이미지 */}
            {post.images.length > 0 && (
              <div className="aspect-[4/3] w-full overflow-hidden bg-gray-100">
                <img
                  src={post.images[0]}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            {/* 책 정보 */}
            <div className="flex items-start gap-3 px-4 py-4">
              <div className="aspect-[20/29] w-16 shrink-0 overflow-hidden rounded-md bg-gray-100">
                {post.book.coverUrl && (
                  <img
                    src={post.book.coverUrl}
                    alt={post.book.title}
                    className="h-full w-full object-contain"
                  />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="grid grid-cols-[48px_1fr] text-sm">
                  <span className="col-span-2 mb-1 truncate text-base font-semibold text-gray-600">
                    {post.book.title}
                  </span>

                  <span className="text-gray-400">저자</span>
                  <span className="truncate text-gray-600">
                    {post.book.author ?? "-"}
                  </span>

                  <span className="text-gray-400">발행처</span>
                  <span className="truncate text-gray-600">
                    {post.book.publisher ?? "-"}
                  </span>

                  <span className="text-gray-400">ISBN</span>
                  <span className="truncate text-gray-600">
                    {post.book.isbn ?? "-"}
                  </span>
                </div>
              </div>
            </div>

            {/* 독서 기록 */}
            <div className="px-4">
              <ExpandableText>{post.content}</ExpandableText>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}

function ExpandableText({ children }: { children: string }) {
  const ref = useRef<HTMLParagraphElement>(null);

  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    setIsOverflowing(element.scrollHeight > element.clientHeight);
  }, [children]);

  return (
    <div>
      <p
        ref={ref}
        className={`text-sm leading-6 text-gray-700 ${
          expanded ? "" : "line-clamp-4"
        }`}
      >
        {children}
      </p>

      {isOverflowing && (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="mt-1 text-sm font-medium text-gray-400"
        >
          {expanded ? "접기" : "더보기"}
        </button>
      )}
    </div>
  );
}
