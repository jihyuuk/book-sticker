import { Pencil } from "lucide-react";
import { Link, useParams } from "react-router";

export default function PostListFAB() {
  const { publicId } = useParams();

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-8 z-50">
      <div className="mx-auto flex w-full max-w-2xl justify-end px-8">
        <Link
          to={`/classroom/${publicId}/posts/new`}
          aria-label="독후감 작성"
          className="pointer-events-auto flex size-14 items-center justify-center rounded-full bg-sky-400 text-white shadow-lg transition hover:bg-sky-500 active:scale-95"
        >
          {/* <Plus className="size-6" /> */}
          <Pencil className="size-6" />
        </Link>
      </div>
    </div>
  );
}
