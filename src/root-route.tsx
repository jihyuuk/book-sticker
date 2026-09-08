import { Routes, Route, Navigate } from "react-router";
import AdminPage from "./pages/admin-page";
import ChartPage from "./pages/chart-page";
import GuestOnlyRoute from "./routes/guest-only-route";
import UserOnlyRoute from "./routes/user-only-route";
import SignInPage from "./pages/auth/sign-in-page";
import SignUpPage from "./pages/auth/sign-up-page";
import PublicChartPage from "./pages/public-chart-page";
import VerifyEmailPage from "./pages/auth/verify-email-page";
import PostCreatePage from "./pages/post/post-create-page";
import PostDetailPage from "./pages/post/post-detail-page";
import PostListPage from "./pages/post/post-list-page";

export default function RootRoute() {
  return (
    <Routes>
      {/* 게스트 (로그인 X)*/}
      <Route element={<GuestOnlyRoute />}>
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
      </Route>

      {/* 유저 (로그인 O) */}
      <Route element={<UserOnlyRoute />}>
        <Route path="/" element={<ChartPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Route>

      {/* 퍼블릭(공유 링크) 아무나 접근 */}
      <Route path="/classroom/:publicId">
        <Route index element={<Navigate to="chart" replace />} />

        <Route path="chart" element={<PublicChartPage />} />

        <Route path="posts">
          <Route index element={<PostListPage />} />
          <Route path="new" element={<PostCreatePage />} />
          <Route path=":postId" element={<PostDetailPage />} />
        </Route>
      </Route>

      {/* 잘 못 된 경로 */}
      <Route path="*" element={<Navigate to={"/"} />} />
    </Routes>
  );
}
