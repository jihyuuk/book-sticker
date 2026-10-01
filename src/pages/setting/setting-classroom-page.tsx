import GlobalLoading from "@/components/global-loading";
import SubHeader from "@/components/header/sub-header";
import SettingClassroomDeleteField from "@/components/setting-classroom/setting-classroom-delete-field";
import SettingClassroomKidsField from "@/components/setting-classroom/setting-classroom-kids-field";
import SettingClassroomNameField from "@/components/setting-classroom/setting-classroom-name-field";
import SettingClassroomPublicLinkField from "@/components/setting-classroom/setting-classroom-public-link-field";
import { useSettingClassroomData } from "@/hooks/queries/use-setting-classroom-data";
import { DOMAIN_URL } from "@/lib/constants";
import { useParams } from "react-router";

export default function SettingClassroomPage() {
  //const openCreateKidModal = useOpenCreateKidModal();
  //const openUpdateKidModal = useOpenUpdateKidModal();
  const { classroomId } = useParams();

  const { data, isPending } = useSettingClassroomData(classroomId ?? "");

  if (!isPending) console.log(data);

  if (isPending || !data || !classroomId) return <GlobalLoading />;

  const publicUrl = `${DOMAIN_URL}/classroom/${data.classroom.public_id}/posts`;

  return (
    <main className="min-h-dvh bg-white">
      <div className="mx-auto w-full max-w-2xl pb-10">
        {/* 헤더 */}
        <SubHeader title="반 설정" />

        <div className="space-y-6">
          {/* 반 이름 */}
          <SettingClassroomNameField oriName={data.classroom.name ?? ""} />

          {/* 공개 주소 */}
          <SettingClassroomPublicLinkField publicUrl={publicUrl} />

          {/* 학생 관리 */}
          <SettingClassroomKidsField
            classroomId={classroomId}
            kids={data.kids}
          />

          {/* 반 삭제 */}
          <SettingClassroomDeleteField />
        </div>
      </div>
    </main>
  );
}
