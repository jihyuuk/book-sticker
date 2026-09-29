import { ChartColumn, Search, Settings, type LucideIcon } from "lucide-react";
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
    {
      label: "검색",
      icon: Search,
      onClick: () => {
        console.log("검색");
      },
    },
    {
      label: "독서 차트",
      icon: ChartColumn,
      onClick: () => {
        console.log("차트");
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
    <div className="flex items-center gap-0.5">
      {iconButtons.map((button) => (
        <button
          key={button.label}
          type="button"
          aria-label={button.label}
          onClick={button.onClick}
          className="flex size-8 items-center justify-center rounded-full transition-colors hover:bg-gray-100 hover:text-gray-900"
        >
          <button.icon className="size-5" strokeWidth={2} />
        </button>
      ))}
    </div>
  );
}
