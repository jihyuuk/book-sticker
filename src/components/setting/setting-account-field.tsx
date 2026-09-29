import { Field, FieldLabel } from "../ui/field";
import { Button } from "../ui/button";
import { KeyRound, LogOut } from "lucide-react";
import { signOut } from "@/api/auth-api";
import { toast } from "sonner";

export default function SettingAccountField() {
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch {
      toast.error("로그아웃에 실패했습니다.");
    }
  };

  return (
    <Field className="w-full px-4 py-5">
      <FieldLabel className="text-sm font-semibold">계정 관리</FieldLabel>

      <div className="grid grid-cols-2 gap-2">
        <Button type="button" variant="outline" className="h-12 font-semibold">
          <KeyRound className="size-4" />
          비밀번호 변경
        </Button>

        <Button
          type="button"
          onClick={handleSignOut}
          variant="outline"
          className="h-12 border-rose-200 bg-rose-50 font-semibold text-rose-600 hover:bg-rose-100 hover:text-rose-700"
        >
          <LogOut className="size-4" />
          로그아웃
        </Button>
      </div>
    </Field>
  );
}
