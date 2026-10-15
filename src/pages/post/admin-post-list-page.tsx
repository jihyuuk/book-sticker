import { useEffect, useRef, useState } from "react";

import logo from "@/assets/sign-in-logo.png";
import GlobalLoading from "@/components/global-loading";
import MainHeader from "@/components/header/main-header";
import PostCard from "@/components/post-card/post-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAdminPosts } from "@/hooks/queries/use-admin-posts";
import { useClassrooms } from "@/hooks/queries/use-classrooms";
import AdminPostListSkeleton from "@/components/skeletons/admin-post-list-skeleton";
import { SELECTED_CLASSROOM_KEY } from "@/lib/constants";
import GlobalError from "@/components/global-error";
import { LoaderCircle, RotateCw } from "lucide-react";

const ALL_CLASSROOMS = "all";

export default function AdminPostListPage() {
  // 반 목록 조회
  const {
    data: classrooms,
    isPending: isClassroomsPending,
    isError: isClassroomsError,
  } = useClassrooms();

  // 선택한 반 ID (저장값 복원)
  const [selectedClassroomId, setSelectedClassroomId] = useState<string | null>(
    () => localStorage.getItem(SELECTED_CLASSROOM_KEY),
  );

  // 선택한 반 ID 유효성 확인
  const isValidClassroom =
    selectedClassroomId === null ||
    classrooms?.some((classroom) => classroom.id === selectedClassroomId) ===
      true;

  // 유효하지 않은 저장값 제거
  useEffect(() => {
    if (!classrooms || isValidClassroom) return;

    setSelectedClassroomId(null);
    localStorage.removeItem(SELECTED_CLASSROOM_KEY);
  }, [classrooms, isValidClassroom]);

  const {
    data,
    isPending: isPostsPending,
    isError: isPostsError,
    isFetching,
    isFetchingNextPage,
    isFetchNextPageError,
    hasNextPage,
    fetchNextPage,
  } = useAdminPosts(
    selectedClassroomId,
    !isClassroomsPending && !isClassroomsError && isValidClassroom,
  );

  // 페이지별 게시글을 하나의 배열로 합치기
  const posts = data?.pages.flatMap((page) => page.posts) ?? [];

  // 다음 페이지 감지 요소
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // 무한스크롤 감지
  useEffect(() => {
    if (!hasNextPage || isFetching || isFetchNextPageError) return;

    const target = loadMoreRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void fetchNextPage();
        }
      },
      {
        rootMargin: "500px",
      },
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [hasNextPage, isFetching, isFetchNextPageError, fetchNextPage]);

  // 반 필터 변경
  const handleClassroomChange = (value: string) => {
    const nextId = value === ALL_CLASSROOMS ? null : value;

    setSelectedClassroomId(nextId);

    if (nextId) {
      localStorage.setItem(SELECTED_CLASSROOM_KEY, nextId);
    } else {
      localStorage.removeItem(SELECTED_CLASSROOM_KEY);
    }

    // 반 변경 시 스크롤 최상단으로 이동
    window.scrollTo(0, 0);
  };

  // 반 목록 최초 로딩
  if (isClassroomsPending) {
    return <GlobalLoading />;
  }

  if (isClassroomsError) {
    return <GlobalError />;
  }

  return (
    <div>
      {/* 헤더 */}
      <MainHeader isAdmin />

      {/* 본문 */}
      <main className="mx-auto w-full max-w-2xl py-3">
        {/* 반 필터링 */}
        <section className="px-page-x mb-6 space-y-6 bg-white">
          <Select
            value={
              isValidClassroom
                ? (selectedClassroomId ?? ALL_CLASSROOMS)
                : ALL_CLASSROOMS
            }
            onValueChange={handleClassroomChange}
          >
            <SelectTrigger variant="underline" className="w-full">
              <SelectValue />
            </SelectTrigger>

            <SelectContent position="popper">
              <SelectItem value={ALL_CLASSROOMS}>전체 반</SelectItem>

              {classrooms?.map((classroom) => (
                <SelectItem key={classroom.id} value={classroom.id}>
                  {classroom.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </section>

        {/* 게시글 목록 */}
        {isPostsPending ? (
          // 로딩
          <AdminPostListSkeleton />
        ) : isPostsError && posts.length === 0 ? (
          // 최초 조회 실패일 때만 전체 에러 표시
          <GlobalError className="h-80" />
        ) : !posts.length ? (
          // 게시글 없을때
          <p className="py-16 text-center text-gray-400">
            아직 작성된 게시글이 없어요.
          </p>
        ) : (
          // 게시글 목록 + 무한스크롤 UI
          <>
            <section className="space-y-20">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  isAdmin
                  post={post}
                  classroomName={
                    selectedClassroomId === null
                      ? (post.classroom.name ?? undefined)
                      : undefined
                  }
                />
              ))}
            </section>

            {/* 다음 페이지 감지 요소 */}
            {hasNextPage && (
              <div ref={loadMoreRef} className="h-1" aria-hidden="true" />
            )}

            {/* 다음 페이지 로딩 */}
            {isFetchingNextPage && (
              <div className="flex justify-center py-10">
                <LoaderCircle className="size-6 animate-spin text-gray-400" />
              </div>
            )}

            {/* 다음 페이지 조회 실패 */}
            {isFetchNextPageError && (
              <div className="py-10 text-center">
                <button
                  className="inline-flex items-center gap-2 text-sm text-gray-500"
                  onClick={() => void fetchNextPage()}
                >
                  <RotateCw className="size-4" />
                  다시 시도하기
                </button>
              </div>
            )}

            {/* 마지막 요소 */}
            {posts.length > 0 && !hasNextPage && !isFetching && (
              <div className="flex flex-col items-center justify-center gap-10 pt-3 pb-10">
                <p className="text-sm text-gray-400">- 마지막 게시물 -</p>

                <img
                  src={logo}
                  width={400}
                  height={143}
                  className="w-full max-w-35"
                />
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

// - 완료 작업 -
// 셀렉트 박스 도입
// 게시물 작성 디자인 수정
// 게시물 수정 디자인 수정
// 어드민 설정 페이지 수정
// confirm 다이얼로그 수정
// 사진 리사이징 최적화
// 이미지 캐러셀 버그 수정
// 이미지 캐러셀 보더 주기
// 작성자 미리저장
// 숫자 인풋
// 원아 추가 수정 하나의 모달로
// 로고 이미지 최적화 배경제거
// 로고 도입 (파비콘 수정)
// 헤더 뒤로가기 버튼 히스토리 없을때 / 로 이동

// - 기능 추가 -
// 0. 원아 리스트 게시글 개수 표시
// 1. 일일 포스팅 수 제한
// 2. 검색 기능
// 3. 동영상
// 4. 아이들 프사

// - 부가기능 -
// 1. 게시물 작성중 뒤로가기 방지
// 2. 작성중인 게시물 임시저장
// 3. 모달 뒤로가기시에 모달이 닫히게
// 4. 클릭시 이미지 전체화면 캐러셀

// - 백엔드 -
// 1. 삭제시 큐 도입 (이미지 삭제를 위해)
// 2. sbin 조회 로직 수정 (카카오 먼저 조회)

// - 스타일 -
// 1. 차트 페이지 디자인 수정
// 2. 로딩(스켈레톤, 이미지, 로고 이미지)
// 3. 모달 x 버튼 크기 및 위치
// 4. 책 입력하기 모달 디자인
// 5. 책 이미지 없을때
// 6. 캐러샐 이미지 로딩중

// - 디테일 수정 -
// 1. password 모달 엔터 버튼(다른 인풋들도 확인)
// 3. 모달 포커스 (pc는 자동 터치는 클릭해서 하게하기)
// 4. 버튼 컴포넌트에 ispending내장

// - 버그 수정 -
// 1.게시글작성(아이폰) -> 이미지 업로드 -> 하단 고정 버튼 스크롤 됌
// 2.학생 삭제시 반영 되게(설정페이지)

// - 최적화 -
// 2.tansantquery 최적화
// 3.이미지 캐러샐 로딩

// - 굳이? -
//1. 수정됨 표시
//2. 도장 기능
//3. og-image 반 별로 다르게

// - 지금 해야 할 것 -
// 1.페이지 별로 서버 기능 및 동작확인
//로그인 페이지 0
//회원가입 페이지 0

//어드민 - 홈 화면 0
//어드민 - 설정
//어드민 - 반 설정
//퍼블릭 - 홈 화면

//퍼블릭 - 포스트 생성
//퍼블릭 - 책 조회
//퍼블릭 - 포스트 수정

//어드민 - 포스트 카드
//퍼블릭 - 포스트 카드

//모달

// 2.백엔드 -> 디테일 -> 스타일 -> 부가기능 -> 새기능 -> 버그수정 -> 최적화
