import GlobalLoading from "@/components/global-loading";
import SubHeader from "@/components/header/sub-header";
import SettingAccountField from "@/components/setting/setting-account-field";
import SettingClassroomsField from "@/components/setting/setting-classrooms-field";
import SettingDailyBookLimitField from "@/components/setting/setting-daily-book-limit-field";
import SettingNameField from "@/components/setting/setting-name-field";
import { useSettingData } from "@/hooks/queries/use-setting-data";

export default function SettingPage() {
  const { data, isPending } = useSettingData();

  if (isPending || !data) return <GlobalLoading />;

  return (
    <div>
      {/* 헤더 */}
      <SubHeader title="설정" />

      <main className="px-page-x mx-auto w-full max-w-2xl space-y-6 py-3 pb-10">
        {/* 유치원명 설정 */}
        <SettingNameField oriName={data.name} />

        {/* 일일 게시글 작성한도 */}
        <SettingDailyBookLimitField oriDailyBookLimit={data.daily_book_limit} />

        {/* 반 관리 */}
        <SettingClassroomsField classrooms={data.classrooms} />

        {/* 계정 */}
        <SettingAccountField />
      </main>
    </div>
  );
}
