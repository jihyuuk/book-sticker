import { Button } from "@/components/ui/button";
import { useKids } from "@/hooks/queries/use-kids";
import { useOpenCreateKidModal } from "@/store/create-kid-modal-store";

export default function AdminPage() {
  const { data } = useKids();
  const openCreateKidModal = useOpenCreateKidModal();

  return (
    <div className="h-dvh">
      <div className="text-2xl font-bold">관리자 페이지</div>
      <Button onClick={openCreateKidModal}>추가</Button>
      <div>
        <div className="text-xl font-bold">아이들</div>
        <div>
          {data?.map((kid) => (
            <div>
              {kid.name} / {kid.bookCount}권
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
