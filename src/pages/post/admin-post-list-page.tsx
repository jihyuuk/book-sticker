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
    <main className="mx-auto min-h-dvh w-full max-w-2xl bg-gray-100">
      <MainHeader isAdmin />

      <div className="bg-white p-3">
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
      </div>

      <div className="space-y-8">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            classroomName={
              selectedClassroomId === null
                ? (post.classroom.name ?? undefined)
                : undefined
            }
          />
        ))}
      </div>
    </main>
  );
}
