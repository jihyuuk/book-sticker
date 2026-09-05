import { Routes, Route, Navigate } from "react-router";
import AdminPage from "./pages/admin-page";
import ChartPage from "./pages/chart-page";
import GuestOnlyRoute from "./components/routes/guest-only-route";
import UserOnlyRoute from "./components/routes/user-only-route";
import SignInPage from "./pages/sign-in-page";
import SignUpPage from "./pages/sign-up-page";

export default function RootRoute() {
  return (
    <Routes>
      <Route element={<GuestOnlyRoute />}>
        <Route path="sign-in" element={<SignInPage />} />
        <Route path="sign-up" element={<SignUpPage />} />
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
