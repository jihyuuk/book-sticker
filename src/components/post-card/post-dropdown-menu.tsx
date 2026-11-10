import { EllipsisVertical, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useState } from "react";
import type { PublicPost } from "@/types/dto/public-dto";
import DropdownMenuBackdrop from "./dropdown-menu-backdrop";
import {
  useOpenPostPasswordDrawer,
  type PostActionType,
} from "@/store/post-password-drawer-store";
import { useParams } from "react-router";
import { isPostEditable } from "@/lib/post-edit-date-limit";
import { useOpenAlertModal } from "@/store/alert-modal";

type Props = {
  post: PublicPost;
};

export default function PostDropdownMenu({ post }: Props) {
  const { publicId } = useParams();
  const openAlertModal = useOpenAlertModal();

  //radix 버그용
  const [menuOpen, setMenuOpen] = useState(false);

  const openPostPasswordDrawer = useOpenPostPasswordDrawer();

  const openDrawer = (type: PostActionType) => {
    if (!publicId) return;

    // 수정은 작성 당일만 허용
    if (type === "EDIT" && !isPostEditable(post.createdAt)) {
      //toast.error("게시글은 당일에만 수정할 수 있습니다.");
      openAlertModal({
        title: "게시글 수정 불가",
        description: "게시글은 당일에만 수정할 수 있습니다.",
        actionLabel: "확인",
        showCancel: false,
        onAction: () => {},
      });
      return;
    }

    openPostPasswordDrawer({
      type,
      post,
      publicId,
    });
  };

  return (
    <>
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        {/* radix 버그 */}
        {/* 가짜 배경 넣음 */}
        {menuOpen && (
          <DropdownMenuBackdrop onClose={() => setMenuOpen(false)} />
        )}

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
          onCloseAutoFocus={(event) => {
            event.preventDefault();
          }}
        >
          <DropdownMenuItem onSelect={() => openDrawer("EDIT")}>
            <div className="flex items-center gap-1.5 py-2 text-gray-700">
              <Pencil size={6} />
              <span>수정</span>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem
            variant="destructive"
            onSelect={() => openDrawer("DELETE")}
          >
            <div className="flex items-center gap-1.5 py-2">
              <Trash2 size={6} />
              <span>삭제</span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
