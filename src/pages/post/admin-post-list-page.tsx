import { useState } from "react";

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

const ALL_CLASSROOMS = "all";

export default function AdminPostListPage() {
  const { data: classrooms, isPending } = useClassrooms();

  // null = 전체
  const [selectedClassroomId, setSelectedClassroomId] = useState<string | null>(
    null,
  );

  const { data: posts, isPending: isPostsPending } =
    useAdminPosts(selectedClassroomId);

  const handleClassroomChange = (value: string) => {
    setSelectedClassroomId(value === ALL_CLASSROOMS ? null : value);
  };

  if (isPending || isPostsPending) {
    return <GlobalLoading />;
  }

  if (!posts) return null;

  return (
    <div>
      {/* 헤더 */}
      <MainHeader isAdmin />

      {/* 본문 */}
      <main className="mx-auto w-full max-w-2xl py-5">
        {/* 반 필터링 */}
        {/* <section className="bg-white">
          <Select
            value={selectedClassroomId ?? ALL_CLASSROOMS}
            onValueChange={handleClassroomChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value={ALL_CLASSROOMS}>전체</SelectItem>

              {classrooms?.map((classroom) => (
                <SelectItem key={classroom.id} value={classroom.id}>
                  {classroom.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </section> */}

        {/* 카드 리스트 */}
        <section className="space-y-15">
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
      </main>
    </div>
  );
}

// 1. 셀렉트 박스 도입
// 2. 반 필터링 적용
// 3. 게시물 작성 디자인 수정
// 4. 게시물 수정 디자인 수정
// 5. 어드민 설정 페이지 수정
// 6. confirm 다이얼로그 수정

// 1. 일일 포스팅 수 제한
// 2. 검색 기능
// 3. 리사이징 최적화 (지금 폰에서 올리면 막힘 리사이징 해도 용량이 큼)

// 1. 차트 디자인 수정

// 1. 백엔드 수정
// 삭제시 큐 도입
// sbin 조회 로직 수정

// 로딩 페이지, 스켈레톤

// 게시물 작성중 뒤로가기 방지

//모달 뒤로가기시에 모달이 닫히게

//최종 동영상 도입
