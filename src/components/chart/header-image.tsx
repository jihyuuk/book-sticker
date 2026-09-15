import { titleImage } from "@/lib/chart-images";

export default function HeaderImage() {
  return (
    <img
      src={titleImage}
      width={1600} //미리 이미지 크기 알려줘서 레이아웃 틀어짐 방지
      height={317}
      fetchPriority="high" //최대한 먼저 로딩
      className="mx-auto w-full max-w-200 pt-5"
    />
  );
}
