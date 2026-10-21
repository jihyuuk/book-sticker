import { useState } from "react";
import PostCaptionField from "../post-field/post-caption-field";
import { toast } from "sonner";
import { useCreatePost } from "@/hooks/mutations/post/use-create-post";
import PostBookField from "../post-field/post-book-field";
import { useNavigate } from "react-router";
import type { PostCreateData } from "@/types/data-types";
import PostKidField from "../post-field/post-kid-field";
import PostPasswordField from "../post-field/post-password-field";
import PostSubmitButton from "../post-field/post-submit-button";
import PostImageField, {
  type PostImageData,
} from "../post-field/post-image-field";
import { FunctionsHttpError } from "@supabase/supabase-js";
import { Loader2 } from "lucide-react";
import { SELECTED_KID_KEY } from "@/lib/constants";
import { FieldGroup } from "../ui/field";
import type { CreatePostParam } from "@/api/post-api";

type Props = {
  data: PostCreateData;
};

export default function PostNewForm({ data }: Props) {
  const navigate = useNavigate();

  const { classroom, kids } = data;

  const { mutate, isPending } = useCreatePost();

  const [kidId, setKidId] = useState(() => {
    const savedKidId = localStorage.getItem(SELECTED_KID_KEY);
    if (savedKidId && kids.some((kid) => kid.id === savedKidId)) {
      return savedKidId;
    }
    return "";
  });
  const [book, setBook] = useState<CreatePostParam["book"] | null>(null);
  const [caption, setCaption] = useState("");
  const [images, setImages] = useState<PostImageData[]>([]);
  const [password, setPassword] = useState("");

  const handleKidChange = (id: string) => {
    setKidId(id);
    localStorage.setItem(SELECTED_KID_KEY, id);
  };

  //이미지 업로드 중인지
  const isImageProcessing = images.some(
    (image) => image.type === "new" && image.status !== "ready",
  );

  const handleSubmit = () => {
    if (isPending || isImageProcessing) return;

    // 에러 표시 활성화
    setShowErrors(true);

    // 첫 번째 오류 찾기
    const firstError = Object.entries(errors).find(
      ([, hasError]) => hasError,
    )?.[0];

    if (firstError) {
      toast.error("필수 항목을 확인해주세요.");

      requestAnimationFrame(() => {
        document.getElementById(`post-${firstError}`)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });

      return;
    }

    // TypeScript 타입 좁히기용
    if (!book) return;

    mutate(
      {
        publicId: classroom.public_id,
        book,
        kidId,
        content: caption,
        password,
        images: images
          .filter((image) => image.type === "new")
          .map((image) => image.file),
      },
      {
        onSuccess: () => {
          toast.success("성공");

          navigate(`/classroom/${classroom.public_id}/posts`, {
            replace: true,
          });
        },
        // onError: (error) => {
        //   alert(error);
        //   toast.error("실패");
        // },
        onError: async (error) => {
          if (error instanceof FunctionsHttpError) {
            const body = await error.context.json();
            alert(JSON.stringify(body));
          } else {
            alert(error instanceof Error ? error.message : String(error));
          }

          toast.error("실패");
        },
      },
    );
  };

  //빈칸처리
  const [showErrors, setShowErrors] = useState(false);

  const errors = {
    kid: !kidId.trim(),
    book: !book,
    content: !caption.trim(),
    password: password.length < 6,
  };

  return (
    <div>
      <FieldGroup className="px-page-x gap-6! py-3 pb-60">
        {/* 작성자 */}
        <PostKidField
          kids={kids}
          value={kidId}
          onValueChange={handleKidChange}
          disabled={isPending}
          error={showErrors && errors.kid}
        />

        {/* 책 */}
        <PostBookField
          value={book}
          onValueChange={setBook}
          disabled={isPending}
          error={showErrors && errors.book}
        />

        {/* 독후감 */}
        <PostCaptionField
          value={caption}
          onValueChange={setCaption}
          disabled={isPending}
          error={showErrors && errors.content}
        />

        {/* 사진 */}
        <PostImageField
          value={images}
          onValueChange={setImages}
          disabled={isPending}
        />

        {/* 비밀번호 */}
        <PostPasswordField
          value={password}
          onValueChange={setPassword}
          disabled={isPending}
          error={showErrors && errors.password}
        />
      </FieldGroup>

      {/* 작성 버튼 */}
      <PostSubmitButton
        onClick={handleSubmit}
        disabled={isPending || isImageProcessing}
      >
        {isPending ? <Loader2 className="animate-spin" /> : "작성하기"}
      </PostSubmitButton>
    </div>
  );
}
