import { Button } from "@/components/ui/button";
import { useKids } from "@/hooks/queries/use-kids";
import { useOpenCreateKidModal } from "@/store/create-kid-modal-store";
import { useOpenUpdateKidModal } from "@/store/update-kid-modal";

export default function AdminPage() {
  const { data } = useKids();
  const openCreateKidModal = useOpenCreateKidModal();
  const openUdpateKidModal = useOpenUpdateKidModal();

  return (
    <div className="h-dvh">
      <div className="text-2xl font-bold">관리자 페이지</div>
      <Button onClick={openCreateKidModal}>추가</Button>
      <div>
        <div className="text-xl font-bold">아이들</div>
        <div>
          {data?.map((kid) => (
            <div key={kid.id} onClick={() => openUdpateKidModal(kid)}>
              {kid.name} / {kid.bookCount}권
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
