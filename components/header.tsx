import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import Link from "next/link"

export default function Header() {
  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">콘텐츠 메이스트로</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/#features" className="text-gray-600 hover:text-gray-900">
            기능 소개
          </Link>
          <Link href="/pricing" className="text-gray-600 hover:text-gray-900">
            요금제
          </Link>
          <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
            대시보드
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <Link href="/dashboard">
            <Button variant="ghost" className="hidden sm:flex">
              <Sparkles className="w-4 h-4 mr-1" />
              대시보드
            </Button>
          </Link>
          <Link href="/auth/login">
            <Button variant="ghost">로그인</Button>
          </Link>
          <Link href="/auth/signup">
            <Button className="bg-purple-600 hover:bg-purple-700">회원가입</Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
