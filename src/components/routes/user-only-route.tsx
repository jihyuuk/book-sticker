import { useSession } from "@/store/session";
import { Navigate, Outlet } from "react-router";

export default function UserOnlyRoute() {
  const session = useSession();
  if (!session) return <Navigate to={"/sign-in"} replace={true} />;

  return <Outlet />;
}
