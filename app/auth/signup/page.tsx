import { SignupForm } from "@/components/auth/signup-form"

export const metadata = {
  title: "회원가입",
  description: "새 계정을 만드세요.",
}

export default function SignupPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">회원가입</h1>
          <p className="text-sm text-muted-foreground">
            이메일 또는 소셜 계정으로 가입하세요
          </p>
        </div>
        <SignupForm />
      </div>
    </div>
  )
}
