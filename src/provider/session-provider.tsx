import { hideInitialLoader } from "@/lib/initial-loader";
import { supabase } from "@/lib/supabse";
import { useIsSessionLoaded, useSetSession } from "@/store/session";
import { useEffect, type ReactNode } from "react";

export default function SessionProvider({ children }: { children: ReactNode }) {
  const setSession = useSetSession();
  const isSessionLoaded = useIsSessionLoaded();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [setSession]);

  // 세션 초기화 완료 후 HTML 로딩 화면 숨기기
  useEffect(() => {
    if (!isSessionLoaded) return;

    hideInitialLoader();
  }, [isSessionLoaded]);

  if (!isSessionLoaded) return null;

  return children;
}
