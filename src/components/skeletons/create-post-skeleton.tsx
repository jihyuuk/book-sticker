import { Field } from "../ui/field";
import { Skeleton } from "../ui/skeleton";

export default function CreatePostSkeleton() {
  return (
    <section
      className="h-[calc(100dvh-80px)] overflow-hidden bg-white md:h-[calc(100dvh-88px)]"
      aria-hidden="true"
    >
      <div className="px-page-x space-y-6">
        {/* 작성자 */}
        <Field>
          <Skeleton className="h-5 w-25!" />
          <Skeleton className="h-12 w-full" />
        </Field>

        {/* 책 */}
        <Field>
          <Skeleton className="h-5 w-25!" />
          <Skeleton className="h-12 w-full" />
        </Field>

        {/* 독후감 */}
        <Field>
          <Skeleton className="h-5 w-25!" />
          <Skeleton className="h-39.5 w-full" />
        </Field>

        {/* 사진 / 동영상*/}
        <Field>
          <Skeleton className="h-5 w-25!" />
          <Skeleton className="size-25!" />
        </Field>

        {/* 비밀번호 */}
        <Field>
          <Skeleton className="h-5 w-25!" />
          <Skeleton className="h-12 w-full" />
        </Field>
      </div>
    </section>
  );
}
