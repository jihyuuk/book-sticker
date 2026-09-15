import { useState } from "react";
import PostCaptionField from "../post-field/post-caption-field";
import { toast } from "sonner";
import { useCreatePost } from "@/hooks/mutations/post/use-create-post";
import PostBookField from "../post-field/post-book-field";
import { useNavigate } from "react-router";
import type { PostCreateData } from "@/types/data-types";
import PostKidField from "../post-field/post-kid-field";
import type { BookInfoData } from "../book/book-info";
import PostPasswordField from "../post-field/post-password-field";
import PostSubmitButton from "../post-field/post-submit-button";

type Props = {
  data: PostCreateData;
};

export default function PostNewForm({ data }: Props) {
  const navigate = useNavigate();

  const { classroom, kids } = data;

  const { mutate, isPending } = useCreatePost();

  //입력 정보
  const [kidId, setKidId] = useState("");
  const [book, setBook] = useState<BookInfoData | null>(null);
  const [caption, setCaption] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    const message = validatePostForm({
      kidId,
      book,
      caption,
      password,
    });

    if (message) {
      toast.error(message);
      return;
    }

    // validatePostForm에서 이미 검사했지만
    // TypeScript 타입 좁히기용
    if (!book) return;

    mutate(
      {
        publicId: classroom.public_id,
        book,
        kidId,
        content: caption,
        password,
      },
      {
        onSuccess: () => {
          toast.success("성공");
          navigate(`/classroom/${classroom.public_id}/posts`, {
            replace: true,
          });
        },
        onError: () => {
          toast.error("실패");
        },
      },
    );
  };

  return (
    <div className="mt-2 space-y-2">
      {/* 작성자 */}
      <PostKidField
        kids={kids}
        value={kidId}
        onValueChange={setKidId}
        disabled={isPending}
      />

      {/* 책 */}
      <PostBookField
        value={book}
        onValueChange={setBook}
        disabled={isPending}
      />

      {/* 독후감 */}
      <PostCaptionField
        value={caption}
        onValueChange={setCaption}
        disabled={isPending}
      />

      {/* 비밀번호 */}
      <PostPasswordField
        value={password}
        onValueChange={setPassword}
        disabled={isPending}
      />

      {/* 작성 버튼 */}
      <PostSubmitButton onClick={handleSubmit} disabled={isPending}>
        {isPending ? "작성 중..." : "작성하기"}
      </PostSubmitButton>
    </div>
  );
}

//검증
function validatePostForm({
  kidId,
  book,
  caption,
  password,
}: {
  kidId: string;
  book: BookInfoData | null;
  caption: string;
  password: string;
}) {
  if (!kidId) return "작성자를 선택해주세요.";
  if (!book) return "책을 선택해주세요.";
  if (!caption.trim()) return "독후감을 작성해주세요.";
  if (!password.trim()) return "비밀번호를 입력해주세요.";
  if (password.length < 4) return "비밀번호는 4자리 이상 입력해주세요.";

  return null;
}
