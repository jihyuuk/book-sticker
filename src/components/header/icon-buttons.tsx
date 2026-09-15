import { ChartColumn, Search, type LucideIcon } from "lucide-react";

type IconButtonProps = {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
};

export default function IconButtons() {
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
  ];

  return (
    <div className="flex items-center gap-0.5">
      {iconButtons.map((b) => (
        <button
          key={b.label}
          type="button"
          aria-label={b.label}
          onClick={b.onClick}
          className="flex size-8 items-center justify-center rounded-full transition-colors hover:bg-gray-100 hover:text-gray-900"
        >
          <b.icon className="size-5" strokeWidth={2} />
        </button>
      ))}
    </div>
  );
}
