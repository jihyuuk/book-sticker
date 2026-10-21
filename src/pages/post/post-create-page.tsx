import SubHeader from "@/components/header/sub-header";
import GlobalError from "@/components/global-error";
import { usePostCreateData } from "@/hooks/queries/use-post-create-data";
import { useNavigate, useParams } from "react-router";
import PostNewForm from "@/components/post-form/post-new-form";
import NotFoundPage from "../not-found-page";
import CreatePostSkeleton from "@/components/skeletons/create-post-skeleton";
import { useOpenAlertModal } from "@/store/alert-modal";

export default function PostCreatePage() {
  const navigate = useNavigate();

  const { publicId } = useParams();
  const { data, isPending, isError } = usePostCreateData(publicId);

  const openAlertModal = useOpenAlertModal();

  //publicId가 주소에 없는 경우
  if (!publicId) return <NotFoundPage />;

  // 등록된 아이가 한명도 없는 경우
  if (data?.kids.length === 0) {
    openAlertModal({
      title: "아직 등록된 원아가 없어요",
      description: "게시글을 작성하려면 선생님이 먼저 원아를 등록해야 해요.",
      actionLabel: "뒤로가기",
      showCancel: false,
      onAction: () => {
        navigate(-1);
      },
    });
  }

  return (
    <div>
      {/* 헤더 */}
      <SubHeader title="독후감 작성" />

      {/* 입력 폼 */}
      <main className="mx-auto w-full max-w-2xl">
        {isPending ? (
          <CreatePostSkeleton />
        ) : isError || !data ? (
          <GlobalError className="h-100" />
        ) : (
          <PostNewForm data={data} />
        )}
      </main>
    </div>
  );
}
