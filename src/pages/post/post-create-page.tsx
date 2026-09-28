import SubHeader from "@/components/header/sub-header";
import GlobalError from "@/components/global-error";
import GlobalLoading from "@/components/global-loading";
import PublicNotFound from "@/components/Public-not-found";
import { usePostCreateData } from "@/hooks/queries/use-post-create-data";
import { useParams } from "react-router";
import PostNewForm from "@/components/post-form/post-new-form";

export default function PostCreatePage() {
  const { publicId } = useParams();
  const { data, isPending, isError } = usePostCreateData(publicId);

  if (isPending) return <GlobalLoading />;
  if (isError) return <GlobalError />;

  //is_public = false면 발동 || 존재하지 않는 publicId
  //선생님이 공개 여부 설정가능
  //나중에 만들거라 일단 기본값 true
  if (!data) {
    return <PublicNotFound />;
  }

  if (data.kids.length === 0) {
    return <div>등록된 아이가 없어요. 선생님에게 문의해주세요.</div>;
  }

  return (
    <main className="min-h-dvh bg-white">
      <div className="mx-auto w-full max-w-2xl pb-10">
        {/* 헤더 */}
        <SubHeader title="독후감 작성" />

        {/* 입력 폼 */}
        <PostNewForm data={data} />
      </div>
    </main>
  );
}
