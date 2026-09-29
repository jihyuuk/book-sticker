import SubHeader from "@/components/header/sub-header";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { KeyRound, LogOut, Plus } from "lucide-react";
import { useNavigate } from "react-router";

const mocks = [
  "햇살반",
  "나눔반",
  "푸른반",
  "새싹반",
  "무지개반",
  "별님반",
  "달님반",
  "하늘반",
  "바다반",
  "꽃잎반",
  "열매반",
  "초록반",
  "꿈나무반",
  "사랑반",
  "희망반",
  "미소반",
  "행복반",
  "튼튼반",
  "기쁨반",
  "솔빛반",
];

export default function SettingPage() {
  const navigate = useNavigate();

  return (
    <main className="min-h-dvh bg-white">
      <div className="mx-auto w-full max-w-2xl pb-10">
        {/* 헤더 */}
        <SubHeader title="설정" />

        {/* 유치원 설정 */}
        <Field className="w-full px-4 py-5">
          <FieldLabel className="text-sm font-semibold">기관명</FieldLabel>

          <div className="flex gap-2">
            <Input
              placeholder="우리 유치원"
              className="h-12 flex-1 px-4 text-sm"
              value={"연세유치원"}
              // onChange={(e) => onValueChange(e.target.value)}
              // disabled={disabled}
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
        <Field className="w-full px-4 py-5">
          <FieldLabel className="text-sm font-semibold">반 관리</FieldLabel>

          <div className="grid grid-cols-2 gap-2">
            {mocks.map((classroom) => (
              <button
                key={classroom}
                type="button"
                onClick={() => navigate("/setting/classroom/1")}
                className="rounded-lg border bg-white py-3 text-center text-sm font-medium transition-colors hover:bg-gray-50"
              >
                {classroom}
              </button>
            ))}

            <button
              type="button"
              className="flex items-center justify-center gap-1 rounded-lg border border-dashed border-sky-300 bg-sky-50 py-3 text-sm font-semibold text-sky-500 transition-colors hover:bg-sky-100"
            >
              <Plus className="size-4" />
              추가
            </button>
          </div>
        </Field>

        <Field className="w-full px-4 py-5">
          <FieldLabel className="text-sm font-semibold">차트 설정</FieldLabel>

          <div className="flex gap-2">
            <Input
              placeholder="1"
              className="h-12 flex-1 px-4 text-sm"
              value={"1"}
              // onChange={(e) => onValueChange(e.target.value)}
              // disabled={disabled}
            />

            <Button
              type="button"
              className="h-12 shrink-0 bg-sky-500 px-5 font-semibold text-white hover:bg-sky-600"
              disabled
            >
              저장
            </Button>
          </div>

          <FieldDescription className="pl-1 text-xs text-gray-400">
            하루 최대 인정 독서 수
          </FieldDescription>
        </Field>

        {/* 계정 */}
        <Field className="w-full px-4 py-5">
          <FieldLabel className="text-sm font-semibold">계정 관리</FieldLabel>

          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/setting/password")}
              className="h-12 font-semibold"
            >
              <KeyRound className="size-4" />
              비밀번호 변경
            </Button>

            <Button
              type="button"
              variant="outline"
              className="h-12 border-rose-200 bg-rose-50 font-semibold text-rose-600 hover:bg-rose-100 hover:text-rose-700"
            >
              <LogOut className="size-4" />
              로그아웃
            </Button>
          </div>
        </Field>
      </div>
    </main>
  );
}
