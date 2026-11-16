import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import SearchHeader from "@/components/header/search-header";
import PostCard from "@/components/post-card/post-card";
import type { PublicPost } from "@/types/dto/public-dto";
import { TailChase } from "ldrs/react";
import "ldrs/react/TailChase.css";
import { ChevronDown, SearchX } from "lucide-react";

// 목업 게시글 데이터 타입
type MockPostInput = {
  id: string;
  kidName: string;
  bookTitle: string;
  content: string;
};

// 다양한 검색 테스트용 목업 데이터
const mockPostData: MockPostInput[] = [
  // 1. 아이 이름만 일치
  {
    id: "name-only",
    kidName: "목하은",
    bookTitle: "별빛 산책",
    content: "오늘은 친구들과 그림책을 읽었어요.",
  },

  // 2. 게시글 내용만 일치 + 여러 번 등장
  {
    id: "content-only",
    kidName: "김서윤",
    bookTitle: "달빛 여행",
    content: "목걸이를 만들었어요. 목걸이가 정말 예뻤어요.",
  },

  // 3. 책 제목만 일치
  {
    id: "book-only",
    kidName: "이민준",
    bookTitle: "나무의 목소리",
    content: "숲속 동물들의 이야기를 읽었습니다.",
  },

  // 4. 아이 이름 + 책 제목 일치
  {
    id: "name-book",
    kidName: "목유진",
    bookTitle: "작은 목소리",
    content: "따뜻하고 재미있는 이야기였어요.",
  },

  // 5. 책 제목 + 게시글 내용 일치
  {
    id: "book-content",
    kidName: "박하린",
    bookTitle: "목업1의 하루",
    content: "목업1을 읽고 목업1에 대해 이야기했어요.",
  },

  // 6. 아이 이름 + 책 제목 + 게시글 내용 모두 일치
  {
    id: "all-fields",
    kidName: "목업2 친구",
    bookTitle: "목업2 그림책",
    content: "목업2 이야기를 읽고 목업2를 그렸어요.",
  },

  // 7. 책 제목과 게시글 내용에 같은 단어 반복
  {
    id: "repeat-keyword",
    kidName: "정지안",
    bookTitle: "어린 왕자",
    content: "어린 왕자를 읽고 어린 왕자의 모험을 이야기했어요.",
  },

  // 8. 목업1 - 아이 이름만 일치
  {
    id: "keyword-name",
    kidName: "목업1 아이",
    bookTitle: "우주 탐험",
    content: "우주를 상상하며 그림을 그렸어요.",
  },

  // 9. 목업2 - 게시글 내용만 일치
  {
    id: "keyword-content",
    kidName: "최도윤",
    bookTitle: "바다 탐험",
    content: "목업2 활동을 기록했어요.",
  },

  // 10. 목업2 - 책 제목만 일치
  {
    id: "keyword-book",
    kidName: "한소율",
    bookTitle: "목업2 동화",
    content: "친구와 함께 즐겁게 읽었어요.",
  },

  // 11. 목 관련 검색어와 일치하지 않는 게시글
  {
    id: "no-match",
    kidName: "홍민아",
    bookTitle: "비밀 정원",
    content: "자연 관찰 기록입니다.",
  },
];

// 목업 게시글 생성
function createMockPost(input: MockPostInput, index: number): PublicPost {
  const { id, kidName, bookTitle, content } = input;

  const createdAt = new Date(Date.now() - index * 60000).toISOString();

  return {
    id,
    content,
    createdAt,
    updatedAt: createdAt,

    kid: {
      id: `kid-${id}`,
      name: kidName,
      profileImageUrl: null,
      bookCount: index + 1,
    },

    book: {
      id: `book-${id}`,
      title: bookTitle,
      author: "테스트 저자",
      publisher: "테스트 출판사",
      isbn: null,
      coverUrl: null,
    },

    images: [],

    media: Array.from({ length: 3 }, (_, imageIndex) => ({
      id: `${id}-image-${imageIndex}`,
      type: "IMAGE" as const,
      url: `https://picsum.photos/seed/bookmate-${id}-${imageIndex}/800/800`,
    })),
  } as PublicPost;
}

// 전체 목업 게시글 생성
const mockPosts = mockPostData.map((item, index) =>
  createMockPost(item, index),
);

// 실제 통합검색처럼 부분 일치 검색
function searchMockPosts(keyword: string): PublicPost[] {
  const query = keyword.trim().toLocaleLowerCase();

  if (!query) return [];

  return mockPosts.filter((post) => {
    const fields = [post.kid.name, post.book.title, post.content];

    return fields.some((field) => field?.toLocaleLowerCase().includes(query));
  });
}

const DEBOUNCE_MS = 500;
const MOCK_RESPONSE_MS = 1000;

type SortOrder = "latest" | "oldest";

export default function SearchPostPageMock() {
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState<SortOrder>("latest");
  const [searchedKeyword, setSearchedKeyword] = useState("");

  const touchStartY = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;

    const diff = Math.abs(e.touches[0].clientY - touchStartY.current);

    // 손가락이 10px 이상 움직이면 포커스 해제
    if (diff > 10) {
      if (document.activeElement instanceof HTMLInputElement) {
        document.activeElement.blur();
      }

      touchStartY.current = null;
    }
  };

  // null: 검색 전, []: 검색 결과 없음
  const [posts, setPosts] = useState<PublicPost[] | null>(null);

  // 게시글 정렬
  const sortedPosts = useMemo(() => {
    if (!posts) return [];

    return [...posts].sort((a, b) => {
      const aTime = new Date(a.createdAt).getTime();
      const bTime = new Date(b.createdAt).getTime();

      return sortOrder === "latest" ? bTime - aTime : aTime - bTime;
    });
  }, [posts, sortOrder]);

  const [viewport, setViewport] = useState(() => ({
    height: window.visualViewport?.height ?? window.innerHeight,
    offsetTop: window.visualViewport?.offsetTop ?? 0,
    headerHeight: 0,
  }));

  // 뷰포트 크기 및 헤더 높이 감지
  useEffect(() => {
    const updateViewport = () => {
      setViewport({
        height: window.visualViewport?.height ?? window.innerHeight,
        offsetTop: window.visualViewport?.offsetTop ?? 0,
        headerHeight:
          document.querySelector("header")?.getBoundingClientRect().height ?? 0,
      });
    };

    updateViewport();

    window.visualViewport?.addEventListener("resize", updateViewport);
    window.visualViewport?.addEventListener("scroll", updateViewport);
    window.addEventListener("resize", updateViewport);

    return () => {
      window.visualViewport?.removeEventListener("resize", updateViewport);
      window.visualViewport?.removeEventListener("scroll", updateViewport);
      window.removeEventListener("resize", updateViewport);
    };
  }, []);

  // 검색어 변경
  const handleChangeValue = (value: string) => {
    setSearchValue(value);
    setIsLoading(false);

    // 검색어를 모두 지웠을 때만 즉시 초기화
    if (!value.trim()) {
      setPosts(null);
      setSearchedKeyword("");
    }
  };

  // 검색어 변경 시 자동 검색 (목업)
  useEffect(() => {
    const keyword = searchValue.trim();

    if (!keyword) return;

    let responseTimer: number | undefined;

    // 500ms 디바운스
    const debounceTimer = window.setTimeout(() => {
      // 서버 요청 시작 (기존 결과 유지)
      setIsLoading(true);

      // 서버 응답 1초 지연 목업
      responseTimer = window.setTimeout(() => {
        // 검색어가 포함된 게시글만 조회
        const results = searchMockPosts(keyword);

        setPosts(results);
        setSearchedKeyword(keyword);
        setIsLoading(false);
      }, MOCK_RESPONSE_MS);
    }, DEBOUNCE_MS);

    return () => {
      window.clearTimeout(debounceTimer);
      window.clearTimeout(responseTimer);
    };
  }, [searchValue]);

  return (
    <div className="flex min-h-dvh flex-col">
      {/* 헤더 */}
      <SearchHeader value={searchValue} onChangeValue={handleChangeValue} />

      {/* 본문 */}
      <main
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={() => (touchStartY.current = null)}
        onTouchCancel={() => (touchStartY.current = null)}
        className="mx-auto w-full max-w-2xl flex-1"
      >
        {/* 검색 결과 건수 및 정렬 */}
        {posts && posts.length > 0 && (
          <div className="flex items-center justify-between px-4 pb-6">
            <div className="flex items-center text-sm">
              <span className="mr-1 font-medium text-gray-700">검색 결과</span>
              <span className="font-semibold text-sky-600">{posts.length}</span>
              <span className="text-gray-500">개</span>
            </div>

            {/* 정렬 선택 */}
            <div className="relative flex items-center">
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                aria-label="검색 결과 정렬"
                className="cursor-pointer appearance-none bg-transparent pr-5 text-sm text-gray-500 outline-none"
              >
                <option value="latest">최신순</option>
                <option value="oldest">오래된순</option>
              </select>

              <ChevronDown className="pointer-events-none absolute right-0 size-4 text-gray-500" />
            </div>
          </div>
        )}

        {/* 검색 결과 */}
        {posts && posts.length > 0 && (
          <section className="space-y-15">
            {sortedPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                highlightKeyword={searchedKeyword}
              />
            ))}
          </section>
        )}

        {/* 검색 결과 없음 */}
        {!isLoading && searchValue.trim() && posts?.length === 0 && (
          <div className="flex flex-col items-center gap-3 pt-25">
            <SearchX className="size-11 text-gray-300" strokeWidth={1.5} />
            <p className="text-gray-500">검색 결과가 없습니다.</p>
          </div>
        )}
      </main>

      {/* 검색 로딩 오버레이 */}
      {isLoading &&
        searchValue.trim() &&
        createPortal(
          <div
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={() => (touchStartY.current = null)}
            onTouchCancel={() => (touchStartY.current = null)}
            className={`fixed inset-x-0 z-40 ${
              posts?.length ? "bg-white/80" : "bg-white"
            }`}
            style={{
              top: viewport.offsetTop + viewport.headerHeight,
              height: "100vh",
            }}
          >
            <div
              className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{
                top: Math.max(0, (viewport.height - viewport.headerHeight) / 2),
              }}
            >
              <TailChase size="25" speed="1.75" color="#9ca3af" />
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
