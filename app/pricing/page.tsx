"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, CreditCard, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"

const pricingPlans = [
  {
    id: "basic",
    name: "기본",
    description: "개인 블로거를 위한 기본 크레딧 팩",
    price: "₩10,000",
    credits: 20,
    features: [
      "블로그 포스트 20개 생성",
      "SEO 최적화 팁",
      "마크다운 포맷 지원",
    ],
  },
  {
    id: "pro",
    name: "프로",
    description: "전문 콘텐츠 크리에이터를 위한 크레딧 팩",
    price: "₩25,000",
    credits: 60,
    popular: true,
    features: [
      "블로그 포스트 60개 생성",
      "SEO 최적화 팁",
      "마크다운 포맷 지원",
      "우선 지원",
    ],
  },
  {
    id: "business",
    name: "비즈니스",
    description: "기업과 에이전시를 위한 크레딧 팩",
    price: "₩50,000",
    credits: 150,
    features: [
      "블로그 포스트 150개 생성",
      "SEO 최적화 팁",
      "마크다운 포맷 지원",
      "우선 지원",
      "전용 고객 관리자",
    ],
  },
]

export default function PricingPage() {
  const { toast } = useToast()
  const [purchasing, setPurchasing] = useState<string | null>(null)

  const handlePurchase = (planId: string) => {
    setPurchasing(planId)
    
    // 실제로는 결제 처리 로직이 필요합니다
    setTimeout(() => {
      setPurchasing(null)
      toast({
        title: "구매 완료",
        description: "크레딧이 계정에 추가되었습니다.",
      })
    }, 2000)
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 flex items-center">
          <Link href="/dashboard" className="flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4 mr-2" />
            대시보드로 돌아가기
          </Link>
        </div>
        
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-2">크레딧 구매</h1>
          <p className="text-gray-600 max-w-lg mx-auto">
            필요한 만큼의 크레딧을 구매하여 고품질 블로그 콘텐츠를 생성하세요.
            각 크레딧으로 하나의 블로그 포스트를 생성할 수 있습니다.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingPlans.map((plan) => (
            <Card key={plan.id} className={`${plan.popular ? "border-primary shadow-lg" : ""}`}>
              {plan.popular && (
                <Badge className="absolute top-4 right-4 bg-primary hover:bg-primary">인기</Badge>
              )}
              <CardHeader>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <span className="text-3xl font-bold">{plan.price}</span>
                </div>
                <div className="flex items-center text-primary font-medium">
                  <CreditCard className="w-4 h-4 mr-2" />
                  <span>{plan.credits}개 크레딧</span>
                </div>
                <ul className="space-y-2">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="w-4 h-4 mr-2 text-green-500 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => handlePurchase(plan.id)}
                  disabled={purchasing === plan.id}
                >
                  {purchasing === plan.id ? "처리 중..." : "구매하기"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12 text-sm text-gray-500">
          <p>모든 가격은 부가세를 포함합니다. 구매한 크레딧은 만료되지 않습니다.</p>
        </div>
      </div>
    </div>
  )
}
