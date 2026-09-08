import type { BookSearchResult } from "@/api/book-api";
import GlobalError from "@/components/global-error";
import GlobalLoading from "@/components/global-loading";
import SelectBook from "@/components/post/select-book";
import SelectKid from "@/components/post/select-kid";
import PublicNotFound from "@/components/Public-not-fount";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreatePost } from "@/hooks/mutations/post/use-create-post";
import { usePublicKids } from "@/hooks/queries/use-public-kids";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

export default function PostCreatePage() {
  const navigate = useNavigate();
  const { publicId } = useParams();

  const {
    data,
    isPending: isKidsPending,
    isError: isKidsError,
  } = usePublicKids(publicId);

  const { mutate: createPost, isPending: isCreating } = useCreatePost();

  //아이 선택
  const kidStorageKey = `selected-kid:${publicId ?? ""}`;

  //리팩토링
  const [kidId, setKidId] = useState(
    () => localStorage.getItem(kidStorageKey) ?? "",
  );

  const handleKidChange = (kidId: string) => {
    setKidId(kidId);
    localStorage.setItem(kidStorageKey, kidId);
  };

  //책 검색 및 선택
  const [selectedBook, setSelectedBook] = useState<BookSearchResult | null>(
    null,
  );

  //글 내용
  const [content, setContent] = useState("");
  //비밀번호
  const [password, setPassword] = useState("");

  //생성하기
  const handleSubmit = () => {
    //invalid처리 + 해당 위치로 이동 구현해야함

    if (!data) return;

    const { classroom } = data;

    if (!kidId) {
      toast.error("아이를 선택해주세요.");
      return;
    }

    if (!selectedBook) {
      toast.error("책을 선택해주세요.");
      return;
    }

    if (!content.trim()) {
      toast.error("독서 기록을 작성해주세요.");
      return;
    }

    if (password.length < 4) {
      toast.error("4자리 이상의 비밀번호를 입력해주세요.");
      return;
    }

    createPost(
      {
        classroomId: classroom.id,
        kidId,
        book: selectedBook,
        content: content.trim(),
        password,
      },
      {
        onSuccess: ({ postId }) => {
          toast.success("독서 기록이 등록되었습니다.");
          navigate(`/classroom/${classroom.public_id}/posts/${postId}`, {
            replace: true,
          });
        },
        onError: () => {
          toast.error("독서 기록 등록에 실패했습니다.");
        },
      },
    );
  };

  if (isKidsPending) return <GlobalLoading />;
  if (isKidsError) return <GlobalError />;
  if (!data) return <PublicNotFound />;

  const { kids } = data;

  return (
    <main className="min-h-dvh bg-gray-50">
      <div className="mx-auto w-full max-w-2xl px-4 py-8 md:py-12">
        {/* 헤더 */}
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
            독서 기록 작성
          </h1>
          <p className="mt-2 text-sm text-gray-500 md:text-base">
            아이와 함께 읽은 책과 이야기를 기록해주세요.
          </p>
        </header>

        <div className="space-y-5">
          {/* 아이 선택 */}
          <SelectKid
            kids={kids}
            value={kidId}
            onValueChange={handleKidChange}
          />

          {/* 책 선택 */}
          <SelectBook
            selectedBook={selectedBook}
            onSelectBook={setSelectedBook}
          />

          {/* 독서 기록 */}
          <section className="rounded-2xl bg-white p-5 shadow-sm">
            <label className="mb-3 block text-base font-bold text-gray-700">
              독서 기록
            </label>

            <textarea
              placeholder="책을 읽고 나눈 이야기나 아이의 반응을 자유롭게 작성해주세요."
              className="min-h-40 w-full resize-none rounded-xl border-2 border-gray-200 bg-white p-4 text-base transition-colors outline-none placeholder:text-gray-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </section>

          {/* 비밀번호 */}
          <section className="rounded-2xl bg-white p-5 shadow-sm">
            <label className="mb-1 block text-base font-bold text-gray-700">
              수정 · 삭제 비밀번호
            </label>

            <p className="mb-3 text-sm text-gray-400">
              작성한 글을 수정하거나 삭제할 때 사용됩니다.
            </p>

            <Input
              type="password"
              inputMode="numeric"
              placeholder="비밀번호를 입력해주세요"
              className="h-14 rounded-xl border-2 text-base"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </section>

          {/* 버튼 */}
          <Button
            onClick={handleSubmit}
            className="mt-2 h-14 w-full rounded-2xl bg-sky-400 text-base font-bold text-white shadow-[0_4px_0_0_rgba(14,165,233,1)] hover:bg-sky-500 active:translate-y-1 active:shadow-none"
            disabled={isCreating}
          >
            {isCreating ? "등록 중..." : "등록하기"}
          </Button>
        </div>
      </div>
    </main>
  );
}
