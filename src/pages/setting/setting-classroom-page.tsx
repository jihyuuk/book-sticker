import GlobalError from "@/components/global-error";
import SubHeader from "@/components/header/sub-header";
import SettingClassroomDeleteField from "@/components/setting-classroom/setting-classroom-delete-field";
import SettingClassroomKidsField from "@/components/setting-classroom/setting-classroom-kids-field";
import SettingClassroomNameField from "@/components/setting-classroom/setting-classroom-name-field";
import SettingClassroomPublicLinkField from "@/components/setting-classroom/setting-classroom-public-link-field";
import SettingClassroomPageSkeleton from "@/components/skeletons/setting-classroom-skeleton";
import { useClassroom } from "@/hooks/queries/use-classroom";
import { useKidsByClassroom } from "@/hooks/queries/use-kids-by-classroom";
import { DOMAIN_URL } from "@/lib/constants";
import { useParams } from "react-router";
import NotFoundPage from "../not-found-page";

export default function SettingClassroomPage() {
  const { classroomId } = useParams();

  // 반 정보
  const { data: classroom, isPending: isClassroomPending } = useClassroom(
    classroomId ?? "",
  );

  // 원아 목록
  const { data: kids, isPending: isKidsPending } = useKidsByClassroom(
    classroomId ?? "",
  );

  const isLoading = isClassroomPending || isKidsPending;
  const isError = !classroom || !kids;

  if (!classroomId) {
    return <NotFoundPage />;
  }

  return (
    <div className="animate-page-slide">
      <SubHeader title="반 설정" />

      <main className="px-page-x mx-auto w-full max-w-2xl py-3">
        {isLoading ? (
          // 로딩
          <SettingClassroomPageSkeleton />
        ) : isError ? (
          // 에러
          <GlobalError className="h-100" />
        ) : (
          // 정상
          <div className="space-y-6 pb-20">
            {/* 반 이름 */}
            <SettingClassroomNameField oriName={classroom.name ?? ""} />

            {/* 공개 주소 */}
            <SettingClassroomPublicLinkField
              publicUrl={`${DOMAIN_URL}/classroom/${classroom.public_id}`}
            />

            {/* 원아 관리 */}
            <SettingClassroomKidsField classroomId={classroomId} kids={kids} />

            {/* 반 삭제 */}
            <SettingClassroomDeleteField classroomId={classroomId} />
          </div>
        )}
      </main>
    </div>
  );
}

//1. 로딩분리
//2. 반이름 필드 수정하기로 수정, aria-invalid적용
//3. 각각 api 점검
