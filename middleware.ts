import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  console.log("미들웨어 실행:", request.url);
  
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const cookie = request.cookies.get(name)?.value;
          console.log(`쿠키 읽기: ${name}`, cookie ? "있음" : "없음");
          return cookie;
        },
        set(name: string, value: string, options: CookieOptions) {
          console.log(`쿠키 설정: ${name}`);
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          console.log(`쿠키 삭제: ${name}`);
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  try {
    // 사용자 세션 새로고침
    console.log("사용자 세션 확인 중");
    const { data: { user } } = await supabase.auth.getUser();
    console.log("현재 사용자:", user ? "인증됨" : "인증되지 않음");
  } catch (error) {
    console.error("미들웨어 인증 오류:", error);
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
} 