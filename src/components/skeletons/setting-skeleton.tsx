import { Skeleton } from "@/components/ui/skeleton";
import { Field } from "@/components/ui/field";

export default function SettingPageSkeleton() {
  return (
    <section
      className="h-[calc(100dvh-80px)] overflow-hidden bg-white md:h-[calc(100dvh-88px)]"
      aria-hidden="true"
    >
      <div className="space-y-6">
        {/* 유치원명 */}
        <Field>
          <Skeleton className="h-5 w-25!" />

          <div className="flex gap-2">
            <Skeleton className="h-12 flex-1" />
            <Skeleton className="h-12 w-20" />
          </div>
        </Field>

        {/* 일일 게시글 작성 한도 */}
        <Field>
          <Skeleton className="h-5 w-25!" />

          <div className="flex gap-2">
            <Skeleton className="h-12 flex-1" />
            <Skeleton className="h-12 w-20" />
          </div>
        </Field>

        {/* 반 관리 */}
        <Field>
          <Skeleton className="h-5 w-25!" />

          <div className="grid grid-cols-2 gap-2">
            <Skeleton className="h-13 w-full" />
            <Skeleton className="h-13 w-full" />
            <Skeleton className="h-13 w-full" />
            <Skeleton className="h-13 w-full" />
            <Skeleton className="h-13 w-full" />
            <Skeleton className="h-13 w-full" />
            <Skeleton className="h-13 w-full" />
            <Skeleton className="h-13 w-full" />
          </div>
        </Field>

        {/* 계정 관리 */}
        <Field>
          <Skeleton className="h-5 w-25!" />

          <div className="grid grid-cols-2 gap-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </Field>
      </div>
    </section>
  );
}
