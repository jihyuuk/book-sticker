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
import { useNavigate } from "react-router";
import { useDeletePost } from "@/hooks/mutations/post/use-delete-post";
import { toast } from "sonner";

type Props = {
  publicId: string;
  postId: string;
};

type ModalActionType = "EDIT" | "DELETE" | null;

export default function PostDropdownMenu({ publicId, postId }: Props) {
  const [modalAction, setModalAction] = useState<ModalActionType>(null);
  const navigate = useNavigate();
  const openAlertModal = useOpenAlertModal();

  const { mutate: deletePost } = useDeletePost();

  const handleVerified = (password: string) => {
    if (modalAction === "EDIT") {
      handleEdit(password);
    } else if (modalAction === "DELETE") {
      handleDelete(password);
    }
  };

  const handleEdit = (password: string) => {
    alert("성공");
    // navigate(`/classroom/${publicId}/posts/${postId}/edit`, {
    //   state: { password },
    // });
  };

  const handleDelete = (password: string) => {
    openAlertModal({
      title: "게시물을 삭제할까요?",
      description: "삭제한 게시물은 다시 복구할 수 없습니다.",
      onAction: () => {
        deletePost(
          {
            postId,
            password,
          },
          {
            onSuccess: () => {
              toast.success("게시물이 삭제되었습니다.");

              navigate(`/classroom/${publicId}/posts`, {
                replace: true,
              });
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
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100"
          >
            <EllipsisVertical className="size-5" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem onClick={() => setModalAction("EDIT")}>
            <Pencil className="size-4" />
            수정
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setModalAction("DELETE")}
            className="text-red-500 hover:text-red-500 focus:text-red-500"
          >
            <Trash2 className="size-4" />
            삭제
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
