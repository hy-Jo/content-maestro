import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/dashboard'
  
  console.log("Auth callback 호출됨:", { code, next });
  
  if (!code) {
    console.log("코드 없음, 로그인 페이지로 리디렉션");
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }
  
  // 대시보드로 리디렉션할 응답 생성
  const response = NextResponse.redirect(new URL(next, request.url))
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
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
    console.log("코드로 세션 교환 시도");
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    console.log("세션 교환 결과:", { data, error });
    
    if (error) {
      console.error("세션 교환 오류:", error);
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
    
    // 사용자 정보 가져오기
    const { data: userData } = await supabase.auth.getUser()
    console.log("인증된 사용자:", userData);
  } catch (error) {
    console.error("인증 처리 중 오류:", error);
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  console.log("인증 성공, 대시보드로 리디렉션");
  return response
} 