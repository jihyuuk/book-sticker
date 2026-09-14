import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router";

type Props = {
  title: string;
};

export default function SubHeader({ title }: Props) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 grid h-14 grid-cols-[28px_1fr_28px] items-center bg-white px-5 md:h-16">
      <button type="button" onClick={() => navigate(-1)} aria-label="뒤로가기">
        <ChevronLeft className="size-7" strokeWidth={1.5} />
      </button>

      <div className="min-w-0 truncate px-2 text-center text-xl font-semibold">
        {title}
      </div>

      <div />
    </header>
  );
}
