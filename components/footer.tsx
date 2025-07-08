import { Sparkles } from "lucide-react"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">콘텐츠 메이스트로</span>
            </div>
            <p className="text-gray-400">AI 기반 블로그 콘텐츠 생성 서비스</p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">서비스</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/pricing" className="hover:text-white">
                  요금제
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white">
                  대시보드
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">지원</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="#" className="hover:text-white">
                  고객센터
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">법적 고지</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="#" className="hover:text-white">
                  이용약관
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  개인정보처리방침
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 콘텐츠 메이스트로. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
