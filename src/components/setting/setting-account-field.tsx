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
    <Field>
      <FieldLabel>계정 관리</FieldLabel>

      <div className="grid grid-cols-2 gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => alert("곧 구현 할 예정입니다.")}
        >
          <div className="flex items-center justify-center gap-2">
            <KeyRound className="size-4" />
            비밀번호 변경
          </div>
        </Button>

        <Button
          onClick={handleSignOut}
          variant="outline"
          className="border-rose-200 bg-rose-50 font-semibold text-rose-600 hover:bg-rose-100 hover:text-rose-700"
        >
          <div className="flex items-center justify-center gap-2">
            <LogOut className="size-4" />
            <span> 로그아웃</span>
          </div>
        </Button>
      </div>
    </Field>
  );
}
