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
    <main className="min-h-dvh bg-white">
      <div className="mx-auto w-full max-w-2xl pb-10">
        {/* 헤더 */}
        <SubHeader title="설정" />

        {/* 유치원명 설정 */}
        <SettingNameField oriName={data.name} />

        {/* 반 관리 */}
        <SettingClassroomsField classrooms={data.classrooms} />

        {/* 차트 설정 */}
        <SettingDailyBookLimitField oriDailyBookLimit={data.daily_book_limit} />

        {/* 계정 */}
        <SettingAccountField />
      </div>
    </main>
  );
}
