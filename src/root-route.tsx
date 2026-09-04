import { Routes, Route, Navigate } from "react-router";
import AdminPage from "./pages/admin-page";
import ChartPage from "./pages/chart-page";

export default function RootRoute() {
  return (
    <Routes>
      <Route path="/" element={<ChartPage />} />
      <Route path="/admin" element={<AdminPage />} />

      {/* 잘 못 된 경로 */}
      <Route path="*" element={<Navigate to={"/"} />} />
    </Routes>
  );
}
