import { LoginForm } from "@/components/auth/login-form"

export const metadata = {
  title: "로그인",
  description: "계정에 로그인하세요.",
}

export default function LoginPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">로그인</h1>
          <p className="text-sm text-muted-foreground">
            이메일 또는 소셜 계정으로 로그인하세요
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
