import { useOpenUpdateKidModal } from "@/store/update-kid-modal";
import type { Kid } from "@/types";

type Props = {
  kid: Kid;
};

export default function KidListItem({ kid }: Props) {
  const openUpdateKidModal = useOpenUpdateKidModal();

  return (
    <div
      onClick={() => openUpdateKidModal(kid)}
      className="flex cursor-pointer items-center justify-between rounded-lg bg-white px-4 py-5 shadow-sm"
    >
      <span className="truncate text-base font-semibold text-gray-800">
        {kid.name}
      </span>

      <div className="flex shrink-0 items-baseline gap-1">
        <span className="text-xl font-bold text-sky-500">{kid.book_count}</span>
        <span className="text-sm text-gray-400">권</span>
      </div>
    </div>
  );
}
