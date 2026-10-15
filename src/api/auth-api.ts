import { supabase } from "@/lib/supabse";

type SignInParam = {
  email: string;
  password: string;
};

type SignUpParam = SignInParam & {
  kindergartenName: string;
};

// 회원가입
export async function signUp({
  email,
  password,
  kindergartenName,
}: SignUpParam) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        kindergarten_name: kindergartenName.trim(),
        // 이메일 인증을 사용 할 경우
        //emailRedirectTo: import.meta.env.VITE_DOMAIN_URL,
      },
    },
  });

  if (error) throw error;

  return data;
}

// 로그인
export async function signIn({ email, password }: SignInParam) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  return data;
}

// 로그아웃
export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) throw error;
}

// 이메일 인증 재 전송
export async function resendVerificationEmail(email: string) {
  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
  });

  if (error) throw error;
}
