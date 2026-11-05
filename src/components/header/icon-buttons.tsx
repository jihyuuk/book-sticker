import {
  ChartColumn,
  CircleQuestionMark,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { useNavigate } from "react-router";

type Props = {
  isAdmin?: boolean;
};

type IconButtonProps = {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
};

export default function IconButtons({ isAdmin = false }: Props) {
  const navigate = useNavigate();

  const iconButtons: IconButtonProps[] = [
    // {
    //   label: "검색",
    //   icon: Search,
    //   onClick: () => {
    //     console.log("검색");
    //   },
    // },
    {
      label: "독서 차트",
      icon: ChartColumn,
      onClick: () => {
        navigate("../chart", { relative: "path" });
      },
    },
    {
      label: "문의",
      icon: CircleQuestionMark,
      onClick: () => {
        window.open(
          "https://docs.google.com/forms/d/e/1FAIpQLSdf7MCO5tXDvrq5fMaPL5sQJ3yaeBLVWN3UGF5byLRunmqU8A/viewform?usp=dialog",
          "_blank",
          "noopener,noreferrer",
        );
      },
    },
    ...(isAdmin
      ? [
          {
            label: "설정",
            icon: Settings,
            onClick: () => {
              navigate("/setting");
            },
          },
        ]
      : []),
  ];

  return (
    <div className="flex items-center gap-4">
      {iconButtons.map((button) => (
        <button
          key={button.label}
          type="button"
          aria-label={button.label}
          onClick={button.onClick}
        >
          <button.icon className="size-6" strokeWidth={2} />
        </button>
      ))}
    </div>
  );
}
