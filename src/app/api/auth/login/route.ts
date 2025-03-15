import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    console.log("로그인 요청:", email, password); // ✅ 이메일과 비밀번호 확인 (디버깅)

    // ✅ Supabase의 auth.signInWithPassword() 사용 (자동으로 해싱된 비밀번호 비교)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      console.error("로그인 실패:", error.message); // ✅ 오류 메시지 출력
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    if (!data.session) {
      console.error("세션이 없음 - 로그인 실패");
      return NextResponse.json({ error: "로그인 실패 - 세션 없음" }, { status: 401 });
    }

    console.log("로그인 성공:", data.session.access_token); // ✅ JWT 토큰 출력 (디버깅)

    return NextResponse.json({ token: data.session.access_token }, { status: 200 });
  } catch (error) {
    console.error("서버 오류:", (error as Error).message);
    return NextResponse.json({ error: "서버 오류 발생" }, { status: 500 });
  }
}
