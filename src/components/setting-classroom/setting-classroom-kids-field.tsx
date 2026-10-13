import { Plus } from "lucide-react";
import { Field, FieldLabel } from "../ui/field";
import type { Kid } from "@/types/entity-types";
import { useOpenCreateKidModal } from "@/store/create-kid-modal-store";
import { useOpenUpdateKidModal } from "@/store/update-kid-modal";
import { Button } from "../ui/button";

type Props = {
  classroomId: string;
  kids: Kid[];
};

export default function SettingClassroomKidsField({
  classroomId,
  kids,
}: Props) {
  const openCreateKidModal = useOpenCreateKidModal();
  const openUpdateKidModal = useOpenUpdateKidModal();

  return (
    <Field>
      <div className="flex items-center gap-2">
        <FieldLabel>원아 관리</FieldLabel>

        <span className="text-xs text-gray-700">
          <strong className="text-primary">{kids.length}</strong>명
        </span>
      </div>

      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        {kids.map((kid) => (
          <button
            key={kid.id}
            type="button"
            onClick={() => openUpdateKidModal(kid)}
            className="flex w-full items-center gap-3 rounded-md border bg-white px-3 py-3 text-left transition-colors hover:bg-gray-50"
          >
            {/* 프로필 이미지 */}
            <div className="size-11 shrink-0 overflow-hidden rounded-full bg-sky-100">
              {kid.profile_image_url ? (
                <img
                  src={kid.profile_image_url}
                  alt={`${kid.name} 프로필`}
                  className="size-full object-cover"
                />
              ) : (
                <div className="flex size-full items-center justify-center text-sm font-semibold text-sky-600">
                  {kid.name.slice(0, 1)}
                </div>
              )}
            </div>

            {/* 아이 정보 */}
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-gray-800">{kid.name}</p>

              <div className="mt-1 flex flex-wrap gap-1 text-xs text-gray-500">
                <span>
                  패들렛{" "}
                  <strong className="font-semibold text-gray-700">
                    {kid.book_count}
                  </strong>
                </span>
                ·
                <span>
                  게시글{" "}
                  <strong className="font-semibold text-gray-700">
                    {kid.book_count + 10}
                  </strong>
                </span>
              </div>
            </div>
          </button>
        ))}

        {/* 학생 추가 */}
        <Button
          variant="outline"
          onClick={() => openCreateKidModal(classroomId)}
          className="text-muted-foreground flex h-[70px] w-full items-center justify-center gap-1 border border-dashed bg-gray-100"
        >
          <Plus className="size-4" />
          원아 등록{" "}
        </Button>
      </div>
    </Field>
  );
}
