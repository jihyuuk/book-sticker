import SubHeader from "@/components/header/sub-header";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useOpenCreateKidModal } from "@/store/create-kid-modal-store";
import { useOpenUpdateKidModal } from "@/store/update-kid-modal";
import type { Kid } from "@/types/entity-types";
import { Plus } from "lucide-react";

const mockKids: Kid[] = [
  {
    id: "kid-1",
    classroom_id: "classroom-1",
    name: "김민준",
    book_count: 15,
    profile_image_url: null,
    created_at: "2026-09-01T09:00:00Z",
  },
  {
    id: "kid-2",
    classroom_id: "classroom-1",
    name: "이서준",
    book_count: 12,
    profile_image_url: null,
    created_at: "2026-09-01T09:05:00Z",
  },
  {
    id: "kid-3",
    classroom_id: "classroom-1",
    name: "박서연",
    book_count: 23,
    profile_image_url: null,
    created_at: "2026-09-01T09:10:00Z",
  },
];

export default function ClassroomSettingPage() {
  const openCreateKidModal = useOpenCreateKidModal();
  const openUpdateKidModal = useOpenUpdateKidModal();
  return (
    <main className="min-h-dvh bg-white">
      <div className="mx-auto w-full max-w-2xl pb-10">
        {/* 헤더 */}
        <SubHeader title="반 설정" />

        <div className="space-y-6">
          {/* 유치원 설정 */}
          <Field className="w-full px-4">
            <FieldLabel className="text-sm font-semibold">반 이름</FieldLabel>

            <div className="flex gap-2">
              <Input
                placeholder="햇살반"
                value={"햇살반"}
                className="h-12 flex-1 px-4 text-sm"
              />

              <Button
                type="button"
                className="h-12 shrink-0 bg-sky-500 px-5 font-semibold text-white hover:bg-sky-600"
                disabled
              >
                저장
              </Button>
            </div>
          </Field>

          <Field className="w-full px-4">
            <FieldLabel className="text-sm font-semibold">
              담임 선생님
            </FieldLabel>

            <div className="flex gap-2">
              <Input
                placeholder="햇살반"
                value={"신혜수"}
                className="h-12 flex-1 px-4 text-sm"
              />

              <Button
                type="button"
                className="h-12 shrink-0 bg-sky-500 px-5 font-semibold text-white hover:bg-sky-600"
                disabled
              >
                저장
              </Button>
            </div>
          </Field>

          {/* 반 관리 */}
          <Field className="w-full px-4">
            <FieldLabel className="text-sm font-semibold">학생 관리</FieldLabel>

            <div className="space-y-2">
              {mockKids.map((kid) => (
                <button
                  key={kid.id}
                  type="button"
                  onClick={() => openUpdateKidModal(kid)}
                  className="flex w-full items-center gap-3 rounded-xl border bg-white px-4 py-3 text-left transition-colors hover:bg-gray-50"
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

                    <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500">
                      <span>
                        패들렛{" "}
                        <strong className="font-semibold text-gray-700">
                          {kid.book_count}권
                        </strong>
                      </span>

                      <span>
                        게시글{" "}
                        <strong className="font-semibold text-gray-700">
                          {kid.book_count + 10}권
                        </strong>
                      </span>

                      <span>
                        차트{" "}
                        <strong className="font-semibold text-gray-700">
                          {kid.book_count + 5}권
                        </strong>
                      </span>
                    </div>
                  </div>
                </button>
              ))}

              {/* 학생 추가 */}
              <button
                type="button"
                onClick={openCreateKidModal}
                className="flex w-full items-center justify-center gap-1 rounded-xl border border-dashed border-sky-300 bg-sky-50 py-3 text-sm font-semibold text-sky-500 transition-colors hover:bg-sky-100"
              >
                <Plus className="size-4" />
                학생 추가
              </button>
            </div>
          </Field>

          <Field className="w-full px-4 pt-2">
            <FieldLabel className="text-sm font-semibold text-rose-600">
              반 삭제
            </FieldLabel>

            <Button
              type="button"
              variant="outline"
              className="h-12 w-full border-rose-200 bg-rose-50 font-semibold text-rose-600 hover:bg-rose-100 hover:text-rose-700"
            >
              반 삭제하기
            </Button>
          </Field>
        </div>
      </div>
    </main>
  );
}
