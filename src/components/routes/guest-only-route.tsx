import { useSession } from "@/store/session";
import { Navigate, Outlet } from "react-router";

export default function GuestOnlyRoute() {
  const session = useSession();

  if (session) return <Navigate to={"/"} replace={true} />;

  return <Outlet />;
}
