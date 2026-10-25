import { EllipsisVertical, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import PostPasswordModal from "../modal/post-password-modal";
import { useState } from "react";
import { useOpenAlertModal } from "@/store/alert-modal";
import { useNavigate, useParams } from "react-router";
import { useDeletePost } from "@/hooks/mutations/post/use-delete-post";
import { toast } from "sonner";
import type { PublicPost } from "@/types/dto/public-dto";

type Props = {
  post: PublicPost;
};

type ModalActionType = "EDIT" | "DELETE" | null;

export default function PostDropdownMenu({ post }: Props) {
  const navigate = useNavigate();
  const { publicId } = useParams();
  const postId = post.id;

  const [modalAction, setModalAction] = useState<ModalActionType>(null);
  const openAlertModal = useOpenAlertModal();

  const { mutate: deletePost } = useDeletePost(publicId);

  const handleVerified = (password: string) => {
    if (modalAction === "EDIT") {
      handleEdit(password);
    } else if (modalAction === "DELETE") {
      handleDelete(password);
    }
  };

  const handleEdit = (password: string) => {
    if (!publicId) return;

    navigate(`/classroom/${publicId}/posts/${postId}/edit`, {
      state: {
        post,
        password,
      },
    });
  };

  const handleDelete = (password: string) => {
    openAlertModal({
      title: "게시물을 삭제할까요?",
      description: "삭제한 게시물은 다시 복구할 수 없습니다.",
      actionVariant: "destructive",
      actionLabel: "삭제하기",
      onAction: () => {
        deletePost(
          {
            postId,
            password,
          },
          {
            onSuccess: () => {
              toast.success("게시물이 삭제되었습니다.");
            },
            onError: () => {
              toast.error("게시물 삭제에 실패했습니다.");
            },
          },
        );
      },
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button type="button" className="text-gray-500">
            <EllipsisVertical className="size-6" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          side="bottom"
          sideOffset={12}
          className="w-40"
        >
          <DropdownMenuItem
            onClick={() => setModalAction("EDIT")}
            className="py-2.5"
          >
            <div className="flex items-center gap-1.5 py-2 text-gray-700">
              <Pencil size={4} />
              <span>수정</span>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setModalAction("DELETE")}
            variant="destructive"
          >
            <div className="flex items-center gap-1.5 py-2">
              <Trash2 size={4} />
              <span>삭제</span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <PostPasswordModal
        postId={postId}
        open={modalAction !== null}
        onOpenChange={() => setModalAction(null)}
        onVerified={handleVerified}
      />
    </>
  );
}
