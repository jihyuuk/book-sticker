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
      <main className="mx-auto w-full max-w-lg py-5">
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
