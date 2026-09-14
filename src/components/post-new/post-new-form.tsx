import { useState } from "react";
import PostCaptionField from "./post-caption-field";
import PostPasswordField from "./post-password-field";
import PostSubmitButton from "./post-submit-button";
import type { BookSearchResult } from "@/api/book-api";
import { toast } from "sonner";
import type { PublicKidListData } from "@/public-types";
import { useCreatePost } from "@/hooks/mutations/post/use-create-post";
import PostKidField from "./post-kid-field";
import PostBookField from "./post-book-field/post-book-field";
import { useNavigate } from "react-router";

type Props = {
  data: PublicKidListData;
};

export default function PostNewForm({ data }: Props) {
  const navigate = useNavigate();

  const { classroom, kids } = data;

  const { mutate, isPending } = useCreatePost();

  //입력 정보
  const [kidId, setKidId] = useState("");
  const [book, setBook] = useState<BookSearchResult | null>(null);
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
      <PostSubmitButton onClick={handleSubmit} disabled={isPending} />
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
  book: BookSearchResult | null;
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
