import { Routes, Route, Navigate } from "react-router";
import { Button } from "./components/ui/button";

export default function RootRoute() {
  return (
    <Routes>
      <Route path="/" element={<Button variant={"destructive"}>버튼</Button>} />
      <Route path="/test" element={"테스트"} />

      {/* 잘 못 된 경로 */}
      <Route path="*" element={<Navigate to={"/"} />} />
    </Routes>
  );
}
