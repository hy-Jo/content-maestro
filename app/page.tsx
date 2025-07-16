import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <header className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-purple-600 rounded-lg"></div>
            <span className="font-bold text-xl">콘텐츠 메이스트로</span>
          </div>
          <div className="flex space-x-4">
            <Link href="/auth/login">
              <Button variant="ghost">로그인</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>회원가입</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block mb-4 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
            AI 기반 콘텐츠 생성
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-6">
            콘텐츠 메이스트로
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            제목이나 주제만 입력하면 AI가 완성도 높은 블로그 콘텐츠와
            <br />
            SEO 최적화 팁까지 자동으로 생성해드립니다
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3">
                무료로 시작하기
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="px-8 py-3 bg-transparent">
                요금제 보기
              </Button>
            </Link>
            <Link href="/photo-app">
              <Button size="lg" variant="outline" className="px-8 py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white border-0 hover:from-pink-600 hover:to-orange-600">
                📸 포토 앱 체험
              </Button>
            </Link>
          </div>
          <p className="text-sm text-gray-500 mt-4">회원가입 시 무료 크레딧 10개 제공 ✨</p>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">왜 콘텐츠 메이스트로인가요?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">블로거와 콘텐츠 마케터를 위한 완벽한 AI 도구</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                ⚡
              </div>
              <CardTitle>빠른 콘텐츠 생성</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                주제만 입력하면 몇 초 만에 완성도 높은 블로그 콘텐츠가 생성됩니다
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                🎯
              </div>
              <CardTitle>SEO 최적화</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">생성된 콘텐츠에 맞는 SEO 팁과 키워드 추천을 함께 제공합니다</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                📈
              </div>
              <CardTitle>합리적인 가격</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">크레딧 기반 시스템으로 필요한 만큼만 사용하고 결제하세요</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="container mx-auto px-4 py-20 bg-white/50 rounded-3xl mx-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">간단하고 투명한 요금제</h2>
          <p className="text-gray-600">필요한 만큼만 사용하는 크레딧 시스템</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Card className="border-2 border-gray-200">
            <CardHeader className="text-center">
              <CardTitle className="text-lg">스타터</CardTitle>
              <div className="text-3xl font-bold text-gray-900">10개</div>
              <p className="text-gray-600">5,000원</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-sm">블로그 콘텐츠 10개</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-sm">SEO 팁 포함</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-500 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-medium">
              인기
            </div>
            <CardHeader className="text-center">
              <CardTitle className="text-lg">프로</CardTitle>
              <div className="text-3xl font-bold text-gray-900">100개</div>
              <p className="text-gray-600">
                <span className="line-through text-gray-400">50,000원</span> 40,000원
              </p>
              <div className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs inline-block">
                20% 할인
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-sm">블로그 콘텐츠 100개</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-sm">SEO 팁 포함</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-sm">우선 지원</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-200">
            <CardHeader className="text-center">
              <CardTitle className="text-lg">엔터프라이즈</CardTitle>
              <div className="text-3xl font-bold text-gray-900">500개</div>
              <p className="text-gray-600">
                <span className="line-through text-gray-400">250,000원</span> 175,000원
              </p>
              <div className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs inline-block">
                30% 할인
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-sm">블로그 콘텐츠 500개</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-sm">SEO 팁 포함</span>
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-sm">전담 지원</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <Link href="/pricing">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
              자세한 요금제 보기
            </Button>
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">지금 시작해보세요</h2>
          <p className="text-gray-600 mb-8">회원가입하고 무료 크레딧 10개로 AI 콘텐츠 생성을 경험해보세요</p>
          <Link href="/auth/signup">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3">
              무료로 시작하기
            </Button>
          </Link>
        </div>
      </section>

      <footer className="container mx-auto px-4 py-8 border-t mt-20">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-purple-600 rounded-lg"></div>
            <span className="font-medium">콘텐츠 메이스트로</span>
          </div>
          <div className="text-sm text-gray-500 mt-4 md:mt-0">
            © 2025 콘텐츠 메이스트로. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
