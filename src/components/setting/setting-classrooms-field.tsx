import type { Classroom } from "@/types/entity-types";
import { Field, FieldLabel } from "../ui/field";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router";
import { useState } from "react";
import CreateClassroomModal from "../modal/create-classroom-modal";

type Props = {
  classrooms: Pick<Classroom, "id" | "name">[];
};

export default function SettingClassroomsField({ classrooms }: Props) {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Field className="w-full px-4 py-5">
        <FieldLabel className="text-sm font-semibold">반 관리</FieldLabel>

        <div className="grid grid-cols-2 gap-2">
          {classrooms.map((classroom) => (
            <button
              key={classroom.id}
              type="button"
              onClick={() => navigate(`/setting/classroom/${classroom.id}`)}
              className="rounded-lg border bg-white py-3 text-center text-sm font-medium transition-colors hover:bg-gray-50"
            >
              {classroom.name}
            </button>
          ))}

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="flex items-center justify-center gap-1 rounded-lg border border-dashed border-sky-300 bg-sky-50 py-3 text-sm font-semibold text-sky-500 transition-colors hover:bg-sky-100"
          >
            <Plus className="size-4" />
            추가
          </button>
        </div>
      </Field>

      <CreateClassroomModal open={isOpen} setOpen={setIsOpen} />
    </>
  );
}
