import { Routes, Route, Navigate } from "react-router";
import AdminPage from "./pages/admin-page";
import ChartPage from "./pages/chart-page";
import GuestOnlyRoute from "./routes/guest-only-route";
import UserOnlyRoute from "./routes/user-only-route";
import SignInPage from "./pages/sign-in-page";
import SignUpPage from "./pages/sign-up-page";
import PublicChartPage from "./pages/public-chart-page";
import VerifyEmailPage from "./pages/verify-email-page";

export default function RootRoute() {
  return (
    <Routes>
      <Route element={<GuestOnlyRoute />}>
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
      </Route>

      <Route element={<UserOnlyRoute />}>
        <Route path="/" element={<ChartPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Route>

      {/* 공유 공개 페이지 */}
      <Route path="/share/:publicId" element={<PublicChartPage />} />

      {/* 잘 못 된 경로 */}
      <Route path="*" element={<Navigate to={"/"} />} />
    </Routes>
  );
}
