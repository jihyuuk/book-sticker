import { EllipsisVertical, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useOpenAlertModal } from "@/store/alert-modal";
import { toast } from "sonner";
import type { PublicPost } from "@/types/public-types";
import { useDeletePostByAdmin } from "@/hooks/mutations/post/use-delete-post-by-admin";

type Props = {
  post: PublicPost;
};

export default function PostDropdownAdminMenu({ post }: Props) {
  const openAlertModal = useOpenAlertModal();
  const { mutate: deletePost } = useDeletePostByAdmin();

  const handleDelete = () => {
    openAlertModal({
      title: "게시물을 삭제할까요?",
      description: "삭제한 게시물은 다시 복구할 수 없습니다.",
      onAction: () => {
        deletePost(post.id, {
          onSuccess: () => {
            toast.success("게시물이 삭제되었습니다.");
          },
          onError: () => {
            toast.error("게시물 삭제에 실패했습니다.");
          },
        });
      },
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button type="button" className="text-gray-500">
            <EllipsisVertical className="size-5" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-28 min-w-28">
          <DropdownMenuItem
            onClick={handleDelete}
            className="py-2.5 text-red-500 focus:text-red-500 [&_svg]:!text-red-500"
          >
            <Trash2 className="size-4" />
            삭제
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
