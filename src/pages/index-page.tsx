import { Button } from "@/components/ui/button";
import { useCreateKid } from "@/hooks/mutations/use-create-kid";
import { useDeleteKid } from "@/hooks/mutations/use-delete-kid";
import { useUpdateKid } from "@/hooks/mutations/use-update-kid";
import { useKids } from "@/hooks/queries/use-kids";

export default function IndexPage() {
  const { data, error, isPending } = useKids();
  const { mutate: deleteKid } = useDeleteKid();
  const { mutate: updateKid } = useUpdateKid();
  const { mutate: createKid } = useCreateKid();

  if (isPending) return <div>로딩중</div>;
  if (error) return <div>에러</div>;

  return (
    <div>
      <div>인덱스 페이지</div>

      <Button onClick={() => createKid("새친구")}>추가</Button>

      {data?.map((kid) => (
        <div className="flex gap-4" key={kid.id}>
          <div>
            {kid.name} : {kid.bookCount}
          </div>
          <div>
            <Button onClick={() => deleteKid(kid.id)}>삭제</Button>
            <Button
              onClick={() =>
                updateKid({ id: kid.id, name: kid.name + "(수정됨)" })
              }
            >
              수정
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
