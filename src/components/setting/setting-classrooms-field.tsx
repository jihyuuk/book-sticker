import type { Classroom } from "@/types/entity-types";
import { Field, FieldLabel } from "../ui/field";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router";
import { useState } from "react";
import CreateClassroomModal from "../modal/create-classroom-modal";
import { Button } from "../ui/button";

type Props = {
  classrooms: Pick<Classroom, "id" | "name">[];
};

export default function SettingClassroomsField({ classrooms }: Props) {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Field>
        <div className="flex items-center gap-2">
          <FieldLabel>반 관리</FieldLabel>
          <span className="text-xs text-gray-700">
            <strong className="text-primary">{classrooms.length}</strong>개 반
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {classrooms.map((classroom) => (
            <Button
              key={classroom.id}
              size="xl"
              variant="outline"
              onClick={() => navigate(`/setting/classroom/${classroom.id}`)}
              className="font-medium"
            >
              {classroom.name}
            </Button>
          ))}

          <Button
            size="xl"
            variant="outline"
            onClick={() => setIsOpen(true)}
            className="text-muted-foreground flex items-center justify-center gap-1 border-dashed bg-gray-100 font-medium"
          >
            <Plus className="size-4" />반 생성
          </Button>
        </div>
      </Field>

      <CreateClassroomModal open={isOpen} setOpen={setIsOpen} />
    </>
  );
}
