# Content Maestro - AI 콘텐츠 생성 플랫폼

## 인증 설정 방법

이 프로젝트는 Supabase를 사용하여 인증 시스템을 구현합니다. 아래 단계를 따라 설정하세요:

### 1. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com/)에 가입하고 새 프로젝트를 생성합니다.
2. 프로젝트가 생성되면 프로젝트 URL과 anon key를 복사합니다.

### 2. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가합니다:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Google 소셜 로그인 설정 (선택사항)

Google 로그인을 활성화하려면:

1. [Google Cloud Console](https://console.cloud.google.com/)에서 새 프로젝트를 생성합니다.
2. OAuth 동의 화면을 설정합니다.
3. OAuth 클라이언트 ID를 생성합니다.
4. 리디렉션 URL로 `https://your-supabase-project.supabase.co/auth/v1/callback`를 추가합니다.
5. 생성된 클라이언트 ID와 비밀키를 Supabase 대시보드의 Authentication > Providers > Google 설정에 추가합니다.

### 4. 이메일 인증 설정

1. Supabase 대시보드에서 Authentication > Email Templates로 이동합니다.
2. 이메일 템플릿을 필요에 맞게 수정합니다.
3. 프로덕션 환경에서는 SMTP 설정을 구성하는 것이 좋습니다.

## 개발 시작하기

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)로 접속하여 애플리케이션을 확인할 수 있습니다.

## 주요 기능

- 이메일 및 Google 소셜 로그인/회원가입
- 보호된 대시보드 페이지
- 인증 상태 관리 