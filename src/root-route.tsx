import { Routes, Route, Navigate } from "react-router";
import GuestOnlyRoute from "./routes/guest-only-route";
import UserOnlyRoute from "./routes/user-only-route";
import SignInPage from "./pages/auth/sign-in-page";
import SignUpPage from "./pages/auth/sign-up-page";
import PublicChartPage from "./pages/public-chart-page";
import VerifyEmailPage from "./pages/auth/verify-email-page";
import PostCreatePage from "./pages/post/post-create-page";
import PostListPage from "./pages/post/post-list-page";
import PostEditPage from "./pages/post/post-edit-page";
import NotFoundPage from "./pages/not-found-page";
import SettingPage from "./pages/setting/setting-page";
import SettingClassroomPage from "./pages/setting/setting-classroom-page";
import AdminPostListPage from "./pages/post/admin-post-list-page";
import ChartPage from "./pages/chart-page";

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
        <Route path="/" element={<AdminPostListPage />} />
        <Route path="/chart" element={<ChartPage />} />
        <Route path="/setting" element={<SettingPage />} />
        <Route
          path="/setting/classroom/:classroomId"
          element={<SettingClassroomPage />}
        />
      </Route>

      {/* 퍼블릭(공유 링크) 아무나 접근 */}
      <Route path="/classroom/:publicId">
        {/* 기본 경로 - 독서 게시판 */}
        <Route index element={<Navigate to="posts" replace />} />

        {/* 독서 게시판 */}
        <Route path="posts">
          <Route index element={<PostListPage />} />
          <Route path="new" element={<PostCreatePage />} />
          <Route path=":postId/edit" element={<PostEditPage />} />
        </Route>

        {/* 독서 현황 차트 */}
        <Route path="chart" element={<PublicChartPage />} />

        {/* 잘 못 된 경로 */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* 잘 못 된 경로 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
