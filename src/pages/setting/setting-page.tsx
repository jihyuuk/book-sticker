import GlobalError from "@/components/global-error";
import SubHeader from "@/components/header/sub-header";
import SettingAccountField from "@/components/setting/setting-account-field";
import SettingClassroomsField from "@/components/setting/setting-classrooms-field";
import SettingDailyBookLimitField from "@/components/setting/setting-daily-book-limit-field";
import SettingNameField from "@/components/setting/setting-name-field";
import SettingPageSkeleton from "@/components/skeletons/setting-skeleton";
import { useClassrooms } from "@/hooks/queries/use-classrooms";
import { useSettingData } from "@/hooks/queries/use-setting-data";

export default function SettingPage() {
  // 세팅 데이터
  const { data: settings, isPending: isSettingsPending } = useSettingData();
  // 반 정보
  const { data: classrooms, isPending: isClassroomsPending } = useClassrooms();

  const isLoading = isSettingsPending || isClassroomsPending;
  const isError = !settings || !classrooms;

  return (
    <div>
      <SubHeader title="설정" />

      <main className="px-page-x mx-auto w-full max-w-2xl py-3">
        {isLoading ? (
          // 로딩
          <SettingPageSkeleton />
        ) : isError ? (
          // 에러
          <GlobalError className="h-100" />
        ) : (
          // 정상
          <div className="space-y-6 pb-20">
            <SettingNameField oriName={settings.name} />

            <SettingDailyBookLimitField
              oriDailyBookLimit={settings.daily_book_limit}
            />

            <SettingClassroomsField classrooms={classrooms} />

            <SettingAccountField />
          </div>
        )}
      </main>
    </div>
  );
}
