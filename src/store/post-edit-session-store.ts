import { create } from "zustand";
import { combine, devtools } from "zustand/middleware";

type State = {
  postId: string | null;
  password: string | null;
};

const initialState: State = {
  postId: null,
  password: null,
};

const usePostEditSessionStore = create(
  devtools(
    combine(initialState, (set) => ({
      actions: {
        // 수정 비밀번호 저장
        setSession: (postId: string, password: string) => {
          set({ postId, password });
        },

        // 수정 비밀번호 삭제
        clearSession: () => {
          set({ ...initialState });
        },
      },
    })),
    {
      name: "PostEditSessionStore",
      enabled: false,
    },
  ),
);

// 수정 세션 저장
export const useSetPostEditSession = () => {
  return usePostEditSessionStore((store) => store.actions.setSession);
};

// 수정 세션 삭제
export const useClearPostEditSession = () => {
  return usePostEditSessionStore((store) => store.actions.clearSession);
};

// 해당 게시글의 비밀번호 조회
export const usePostEditPassword = (postId?: string) => {
  return usePostEditSessionStore((store) =>
    postId && store.postId === postId ? store.password : null,
  );
};
