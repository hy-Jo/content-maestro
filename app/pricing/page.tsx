"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Sparkles } from "lucide-react"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function PricingPage() {
  const handlePurchase = (credits: number, price: number) => {
    // 실제 결제 로직 (토스페이먼츠 연동)
    alert(`${credits}개 크레딧 (${price.toLocaleString()}원) 결제 페이지로 이동합니다.`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <Header />

      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 bg-purple-100 text-purple-700">
            <Sparkles className="w-4 h-4 mr-2" />
            크레딧 기반 시스템
          </Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">간단하고 투명한 요금제</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            필요한 만큼만 사용하는 크레딧 시스템으로
            <br />
            부담 없이 AI 콘텐츠 생성을 시작하세요
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          {/* 스타터 */}
          <Card className="border-2 border-gray-200 hover:border-purple-300 transition-colors">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">스타터</CardTitle>
              <div className="text-4xl font-bold text-gray-900 my-4">10개</div>
              <div className="text-2xl font-semibold text-purple-600">5,000원</div>
              <CardDescription className="mt-2">개인 블로거에게 적합</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ul className="space-y-3">
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>블로그 콘텐츠 10개 생성</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>SEO 최적화 팁 포함</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>기본 고객 지원</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>콘텐츠 편집 기능</span>
                </li>
              </ul>
              <Button className="w-full bg-gray-600 hover:bg-gray-700" onClick={() => handlePurchase(10, 5000)}>
                구매하기
              </Button>
            </CardContent>
          </Card>

          {/* 프로 (인기) */}
          <Card className="border-2 border-purple-500 relative hover:border-purple-600 transition-colors">
            <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-500 text-white">
              가장 인기
            </Badge>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">프로</CardTitle>
              <div className="text-4xl font-bold text-gray-900 my-4">100개</div>
              <div className="space-y-1">
                <div className="text-lg text-gray-400 line-through">50,000원</div>
                <div className="text-2xl font-semibold text-purple-600">40,000원</div>
                <Badge variant="secondary" className="bg-red-100 text-red-700">
                  20% 할인
                </Badge>
              </div>
              <CardDescription className="mt-2">콘텐츠 마케터에게 최적</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ul className="space-y-3">
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>블로그 콘텐츠 100개 생성</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>고급 SEO 최적화 팁</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>우선 고객 지원</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>콘텐츠 템플릿 제공</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>키워드 분석 도구</span>
                </li>
              </ul>
              <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={() => handlePurchase(100, 40000)}>
                구매하기
              </Button>
            </CardContent>
          </Card>

          {/* 엔터프라이즈 */}
          <Card className="border-2 border-gray-200 hover:border-purple-300 transition-colors">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">엔터프라이즈</CardTitle>
              <div className="text-4xl font-bold text-gray-900 my-4">500개</div>
              <div className="space-y-1">
                <div className="text-lg text-gray-400 line-through">250,000원</div>
                <div className="text-2xl font-semibold text-purple-600">175,000원</div>
                <Badge variant="secondary" className="bg-red-100 text-red-700">
                  30% 할인
                </Badge>
              </div>
              <CardDescription className="mt-2">대규모 콘텐츠 제작팀용</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ul className="space-y-3">
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>블로그 콘텐츠 500개 생성</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>프리미엄 SEO 분석</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>전담 고객 지원</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>팀 협업 기능</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>API 액세스</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>맞춤형 브랜딩</span>
                </li>
              </ul>
              <Button className="w-full bg-gray-600 hover:bg-gray-700" onClick={() => handlePurchase(500, 175000)}>
                구매하기
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* FAQ 섹션 */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">자주 묻는 질문</h2>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">크레딧은 어떻게 사용되나요?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  블로그 콘텐츠 1개를 생성할 때마다 크레딧 1개가 차감됩니다. SEO 팁은 추가 비용 없이 함께 제공됩니다.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">크레딧에 유효기간이 있나요?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  구매한 크레딧은 구매일로부터 1년간 사용 가능합니다. 유효기간 내에 사용하지 않은 크레딧은 자동으로
                  소멸됩니다.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">환불이 가능한가요?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  구매 후 7일 이내, 크레딧을 사용하지 않은 경우에 한해 100% 환불이 가능합니다. 부분 사용한 경우 사용하지
                  않은 크레딧에 대해서만 환불됩니다.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold mb-4">아직 결정하지 못하셨나요?</h3>
          <p className="text-gray-600 mb-6">회원가입하고 무료 크레딧 10개로 먼저 체험해보세요</p>
          <Link href="/auth/signup">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700 mr-4">
              무료로 시작하기
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button size="lg" variant="outline">
              대시보드 보기
            </Button>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  )
}
