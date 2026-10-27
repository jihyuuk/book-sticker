import { toast, Toaster } from "sonner";

export default function AppToaster() {
  // 그냥 toast 클릭시 바로 닫히게 수정
  return (
    <div onMouseEnter={() => toast.dismiss()} onClick={() => toast.dismiss()}>
      <Toaster richColors position="top-center" duration={2000} />
    </div>
  );
}
