import { Routes, Route, Navigate } from "react-router";
import IndexPage from "./pages/index-page";
import AdminPage from "./pages/admin-page";

export default function RootRoute() {
  return (
    <Routes>
      <Route path="/" element={<IndexPage />} />
      <Route path="/admin" element={<AdminPage />} />

      {/* 잘 못 된 경로 */}
      <Route path="*" element={<Navigate to={"/"} />} />
    </Routes>
  );
}
