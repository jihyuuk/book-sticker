import { Skeleton } from "@/components/ui/skeleton";
import { Field } from "@/components/ui/field";

export default function SettingClassroomPageSkeleton() {
  return (
    <section
      className="h-[calc(100dvh-80px)] overflow-hidden bg-white md:h-[calc(100dvh-88px)]"
      aria-hidden="true"
    >
      <div className="space-y-6">
        {/* 반 이름 */}
        <Field>
          <Skeleton className="h-5 w-25!" />

          <div className="flex gap-2">
            <Skeleton className="h-12 flex-1" />
            <Skeleton className="h-12 w-20" />
          </div>
        </Field>

        {/* 공유 링크 */}
        <Field>
          <Skeleton className="h-5 w-25!" />

          <div className="flex gap-2">
            <Skeleton className="h-12 flex-1" />
            <Skeleton className="h-12 w-12.5" />
          </div>

          <Skeleton className="h-4 w-40!" />
        </Field>

        {/* 원아 관리 */}
        <Field>
          <Skeleton className="h-5 w-25!" />

          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            <Skeleton className="h-17.5 w-full" />
            <Skeleton className="h-17.5 w-full" />
            <Skeleton className="h-17.5 w-full" />
            <Skeleton className="h-17.5 w-full" />
            <Skeleton className="h-17.5 w-full" />
            <Skeleton className="h-17.5 w-full" />
            <Skeleton className="h-17.5 w-full" />
            <Skeleton className="h-17.5 w-full" />
          </div>
        </Field>

        {/* 기타 */}
        <Field>
          <Skeleton className="h-5 w-25!" />

          <div className="grid grid-cols-1 gap-2">
            <Skeleton className="h-12 w-full" />
          </div>
        </Field>
      </div>
    </section>
  );
}
