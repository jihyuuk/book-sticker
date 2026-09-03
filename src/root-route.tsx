import { Routes, Route, Navigate } from "react-router";
import IndexPage from "./pages/index-page";

export default function RootRoute() {
  return (
    <Routes>
      <Route path="/" element={<IndexPage />} />
      <Route path="/test" element={"테스트"} />

      {/* 잘 못 된 경로 */}
      <Route path="*" element={<Navigate to={"/"} />} />
    </Routes>
  );
}
