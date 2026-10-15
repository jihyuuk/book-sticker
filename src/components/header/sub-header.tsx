import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router";

type Props = {
  title: string;
};

export default function SubHeader({ title }: Props) {
  const navigate = useNavigate();
  const { publicId } = useParams();

  const handleBack = () => {
    const canGoBack = (window.history.state?.idx ?? 0) > 0;

    if (canGoBack) {
      navigate(-1);
      return;
    }

    // 이전 히스토리가 없는 경우
    const fallbackPath = publicId ? `/classroom/${publicId}/posts` : "/";

    navigate(fallbackPath, { replace: true });
  };

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center justify-center bg-white md:h-16">
      <div className="px-page-x grid w-full max-w-2xl grid-cols-[24px_1fr_24px] items-center">
        <button type="button" onClick={handleBack} aria-label="뒤로가기">
          <ArrowLeft className="size-6" strokeWidth={1.5} />
        </button>

        <div className="text-title-2 min-w-0 truncate px-2 text-center font-semibold">
          {title}
        </div>

        <div />
      </div>
    </header>
  );
}
