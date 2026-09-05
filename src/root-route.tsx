import { Routes, Route, Navigate } from "react-router";
import AdminPage from "./pages/admin-page";
import ChartPage from "./pages/chart-page";
import GuestOnlyRoute from "./components/routes/guest-only-route";
import UserOnlyRoute from "./components/routes/user-only-route";

export default function RootRoute() {
  return (
    <Routes>
      <Route element={<GuestOnlyRoute />}>
        <Route path="sign-in" element={"로그인 페이지"} />
        <Route path="sign-up" element={"회원가입 페이지"} />
      </Route>

      <Route element={<UserOnlyRoute />}>
        <Route path="/" element={<ChartPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Route>

      {/* 잘 못 된 경로 */}
      <Route path="*" element={<Navigate to={"/"} />} />
    </Routes>
  );
}
