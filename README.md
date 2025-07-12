# Content Maestro - AI 콘텐츠 생성 플랫폼

## 인증 설정 방법

이 프로젝트는 Supabase를 사용하여 인증 시스템을 구현합니다. 아래 단계를 따라 설정하세요:

### 1. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com/)에 가입하고 새 프로젝트를 생성합니다.
2. 프로젝트가 생성되면 프로젝트 URL과 anon key를 복사합니다.

### 2. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가합니다:

```
# Supabase 환경 변수
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# OpenAI API 키
OPENAI_API_KEY=your-openai-api-key

# 토스페이먼츠 환경 변수
NEXT_PUBLIC_TOSS_CLIENT_KEY=your-toss-client-key
TOSS_SECRET_KEY=your-toss-secret-key
```

### 3. OpenAI API 설정

1. [OpenAI](https://platform.openai.com/)에 가입하고 API 키를 생성합니다.
2. 생성된 API 키를 `.env.local` 파일의 `OPENAI_API_KEY` 값으로 설정합니다.
3. OpenAI API는 유료 서비스이므로, 사용량에 따라 비용이 발생할 수 있습니다.

### 4. 데이터베이스 설정

Supabase에서 다음 테이블을 생성합니다:

1. `user_credits` - 사용자 크레딧 정보
   - `id` (primary key, references auth.users.id)
   - `credits` (integer)
   - `created_at` (timestamp with time zone)
   - `updated_at` (timestamp with time zone)

2. `content_generations` - 생성된 콘텐츠 정보
   - `id` (uuid, primary key)
   - `user_id` (references auth.users.id)
   - `topic` (text)
   - `content` (text)
   - `seo_tips` (text[])
   - `created_at` (timestamp with time zone, default: now())

3. `credit_transactions` - 크레딧 거래 내역
   - `id` (uuid, primary key)
   - `user_id` (references auth.users.id)
   - `amount` (integer)
   - `description` (text)
   - `content_generations_id` (uuid, references content_generations.id, nullable)
   - `created_at` (timestamp with time zone, default: now())

### 5. Google 소셜 로그인 설정 (선택사항)

Google 로그인을 활성화하려면:

1. [Google Cloud Console](https://console.cloud.google.com/)에서 새 프로젝트를 생성합니다.
2. OAuth 동의 화면을 설정합니다.
3. OAuth 클라이언트 ID를 생성합니다.
4. 리디렉션 URL로 `https://your-supabase-project.supabase.co/auth/v1/callback`를 추가합니다.
5. 생성된 클라이언트 ID와 비밀키를 Supabase 대시보드의 Authentication > Providers > Google 설정에 추가합니다.

### 6. 이메일 인증 설정

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
- AI를 활용한 블로그 콘텐츠 자동 생성
- SEO 최적화 팁 제공
- 크레딧 기반 결제 시스템 