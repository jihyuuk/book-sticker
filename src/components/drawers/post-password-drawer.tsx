import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { FunctionsHttpError } from "@supabase/supabase-js";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import PasswordInput from "@/components/ui/password-input";

import { useDeletePost } from "@/hooks/mutations/post/use-delete-post";
import { usePostPasswordDrawer } from "@/store/post-password-drawer-store";
import { FieldGroup, FieldLabel } from "../ui/field";

export default function PostPasswordDrawer() {
  const { isOpen, type, post, publicId, actions } = usePostPasswordDrawer();

  const inputRef = useRef<HTMLInputElement>(null);
  const allowBlurRef = useRef(false);

  const { mutate: deletePost, isPending } = useDeletePost(publicId);

  const [password, setPassword] = useState("");
  const [bottomInset, setBottomInset] = useState(0);

  // 768px 이상이면 Dialog
  const [isDesktop, setIsDesktop] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(min-width: 672px)").matches,
  );

  // 반응형 감지
  useEffect(() => {
    const media = window.matchMedia("(min-width: 672px)");

    const update = (event: MediaQueryListEvent) => {
      setIsDesktop(event.matches);
    };

    setIsDesktop(media.matches);
    media.addEventListener("change", update);

    return () => {
      media.removeEventListener("change", update);
    };
  }, []);

  // 게시글이나 액션 변경 시 비밀번호 초기화
  useEffect(() => {
    if (!isOpen) return;

    setPassword("");
  }, [isOpen, post?.id, type]);

  // 모바일 키보드 위치 보정
  useEffect(() => {
    if (!isOpen || isDesktop) return;

    const viewport = window.visualViewport;
    if (!viewport) return;

    const update = () => {
      const keyboardHeight = window.innerHeight - viewport.height;

      setBottomInset(
        keyboardHeight > 150
          ? Math.max(0, keyboardHeight - viewport.offsetTop)
          : 0,
      );
    };

    update();

    viewport.addEventListener("resize", update);
    viewport.addEventListener("scroll", update);

    return () => {
      viewport.removeEventListener("resize", update);
      viewport.removeEventListener("scroll", update);
      setBottomInset(0);
    };
  }, [isOpen, isDesktop]);

  // 포커스 해제
  const releaseFocus = () => {
    allowBlurRef.current = true;
    inputRef.current?.blur();
  };

  // 닫기
  const close = () => {
    if (isPending) return;

    releaseFocus();
    actions.close();
  };

  // 삭제
  const handleDelete = (postId: string) => {
    deletePost(
      { postId, password },
      {
        onSuccess: () => {
          releaseFocus();
          actions.close();
          toast.success("게시물이 삭제되었습니다.");
        },
        onError: (error) => {
          if (
            error instanceof FunctionsHttpError &&
            error.context.status === 401
          ) {
            setPassword("");
            toast.error("비밀번호가 올바르지 않습니다.");
            return;
          }

          toast.error("오류가 발생했습니다.");
        },
      },
    );
  };

  // 수정 (추후 구현)
  const handleEdit = (postId: string) => {
    console.log(postId);
  };

  // 제출
  const handleSubmit = () => {
    if (!isOpen || !password.trim() || isPending) return;

    const postId = post.id;

    if (type === "EDIT") {
      handleEdit(postId);
    } else if (type === "DELETE") {
      handleDelete(postId);
    }
  };

  // 공통 입력 UI
  const content = (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        handleSubmit();
      }}
    >
      <FieldGroup className="gap-3">
        <FieldLabel className="text-lg">
          {type === "EDIT" ? "게시글 수정" : "게시글 삭제"}
        </FieldLabel>

        <PasswordInput
          ref={inputRef}
          value={password}
          onChange={(event) => {
            if (isPending) return;
            setPassword(event.target.value);
          }}
          onBlur={(event) => {
            // 모바일 Drawer에서만 포커스 유지
            if (!isDesktop && isOpen && !allowBlurRef.current) {
              event.currentTarget.focus({ preventScroll: true });
            }
          }}
          placeholder="비밀번호를 입력해주세요."
          className="w-full"
        />

        <Button
          type="submit"
          className="w-full"
          variant={type === "DELETE" ? "destructive" : "default"}
          disabled={!password.trim() || isPending}
        >
          {isPending ? (
            <Loader2 className="animate-spin" />
          ) : type === "EDIT" ? (
            "확인"
          ) : (
            "삭제"
          )}
        </Button>
      </FieldGroup>
    </form>
  );

  // 공통 자동 포커스
  const handleOpenAutoFocus = (event: Event) => {
    event.preventDefault();

    allowBlurRef.current = false;
    inputRef.current?.focus({ preventScroll: true });
  };

  // 데스크톱 Dialog
  if (isDesktop) {
    return (
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) close();
        }}
      >
        <DialogContent
          className="max-w-md p-5"
          aria-describedby={undefined}
          onOpenAutoFocus={handleOpenAutoFocus}
          onCloseAutoFocus={(event) => event.preventDefault()}
        >
          {content}
        </DialogContent>
      </Dialog>
    );
  }

  // 모바일 Drawer
  return (
    <Drawer
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) close();
      }}
      repositionInputs={false}
      dismissible={!isPending}
      onClose={releaseFocus}
    >
      <DrawerContent
        style={{ bottom: `${bottomInset}px` }}
        onOpenAutoFocus={handleOpenAutoFocus}
      >
        <div className="p-4 pb-5">{content}</div>
      </DrawerContent>
    </Drawer>
  );
}
