import { Routes, Route, Navigate } from "react-router";
import AdminPage from "./pages/admin-page";
import ChartPage from "./pages/chart-page";
import GuestOnlyRoute from "./routes/guest-only-route";
import UserOnlyRoute from "./routes/user-only-route";
import SignInPage from "./pages/sign-in-page";
import SignUpPage from "./pages/sign-up-page";
import PublicChartPage from "./pages/public-chart-page";
import VerifyEmailPage from "./pages/verify-email-page";
import PostCreatePage from "./pages/post-create-page";
import PublicClassroomRoute from "./routes/public-classroom-route";
import PostDetailPage from "./pages/post-detail-page";

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

      {/* 임시 개발용 포스트 생성 페이지 */}
      <Route path="/classroom/:publicId" element={<PublicClassroomRoute />}>
        <Route path="posts/new" element={<PostCreatePage />} />
        <Route path="posts/:postId" element={<PostDetailPage />} />
      </Route>

      {/* 잘 못 된 경로 */}
      <Route path="*" element={<Navigate to={"/"} />} />
    </Routes>
  );
}
