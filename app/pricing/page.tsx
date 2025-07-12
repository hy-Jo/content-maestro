"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, CreditCard, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { createPaymentData, paymentPlans } from "@/lib/toss-payments"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import Script from "next/script"

// 가격 정보를 paymentPlans에서 가져오도록 수정
const pricingPlans = [
  {
    id: "basic",
    name: "기본",
    description: "개인 블로거를 위한 기본 크레딧 팩",
    price: "₩10,000",
    credits: paymentPlans.basic.credits,
    features: [
      `블로그 포스트 ${paymentPlans.basic.credits}개 생성`,
      "SEO 최적화 팁",
      "마크다운 포맷 지원",
    ],
  },
  {
    id: "pro",
    name: "프로",
    description: "전문 콘텐츠 크리에이터를 위한 크레딧 팩",
    price: "₩25,000",
    credits: paymentPlans.pro.credits,
    popular: true,
    features: [
      `블로그 포스트 ${paymentPlans.pro.credits}개 생성`,
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
    credits: paymentPlans.business.credits,
    features: [
      `블로그 포스트 ${paymentPlans.business.credits}개 생성`,
      "SEO 최적화 팁",
      "마크다운 포맷 지원",
      "우선 지원",
      "전용 고객 관리자",
    ],
  },
]

// 토스페이먼츠 타입 선언
declare global {
  interface Window {
    TossPayments?: any;
  }
}

// 결제 요청 파라미터 타입
interface PaymentParams {
  orderId: string;
  orderName: string;
  successUrl: string;
  failUrl: string;
  customerEmail?: string;
  customerName?: string;
}

export default function PricingPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [purchasing, setPurchasing] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [tossWidgets, setTossWidgets] = useState<any>(null)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [currentPlan, setCurrentPlan] = useState<string | null>(null)
  const [paymentData, setPaymentData] = useState<any>(null)
  const [sdkLoaded, setSdkLoaded] = useState(false)
  const [paymentMethodsLoaded, setPaymentMethodsLoaded] = useState(false)
  
  // 결제 UI를 렌더링할 DOM 요소 참조
  const paymentMethodRef = useRef<HTMLDivElement>(null)
  const agreementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // 현재 로그인한 사용자 정보 가져오기
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast({
          title: "로그인이 필요합니다",
          description: "크레딧을 구매하려면 로그인해주세요.",
          variant: "destructive",
        })
        router.push("/auth/login")
        return
      }
      setUser(user)
    }

    fetchUser()
  }, [router, toast])
  
  // 결제 모달이 열릴 때 토스페이먼츠 위젯 초기화
  useEffect(() => {
    if (!isPaymentModalOpen || !paymentData || !sdkLoaded) return
    
    // 모달이 열린 후 약간의 지연을 주어 DOM이 완전히 렌더링되도록 함
    const timer = setTimeout(() => {
      initializeTossPayments()
    }, 500)
    
    return () => {
      clearTimeout(timer)
      setTossWidgets(null)
      setPaymentMethodsLoaded(false)
    }
  }, [isPaymentModalOpen, paymentData, sdkLoaded])
  
  const initializeTossPayments = async () => {
    try {
      if (typeof window === 'undefined' || !window.TossPayments) {
        console.error('토스페이먼츠 SDK를 찾을 수 없습니다.')
        return
      }
      
      if (!paymentMethodRef.current || !agreementRef.current) {
        console.error('결제 UI를 렌더링할 DOM 요소를 찾을 수 없습니다.')
        return
      }
      
      console.log('토스페이먼츠 위젯 초기화 시작')
      
      // 토스페이먼츠 초기화
      const clientKey = 'test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm'
      const tossPayments = window.TossPayments(clientKey)
      
      // 비회원 결제 위젯 초기화
      const widgets = tossPayments.widgets({ 
        customerKey: window.TossPayments.ANONYMOUS 
      })
      
      setTossWidgets(widgets)
      console.log('토스페이먼츠 위젯 객체 생성 성공')
      
      // 결제 금액 설정
      await widgets.setAmount({
        currency: "KRW",
        value: paymentData.amount,
      })
      console.log('결제 금액 설정 완료:', paymentData.amount)
      
      // 결제 UI 및 이용약관 UI 렌더링
      try {
        console.log('결제 UI 렌더링 시작')
        console.log('payment-method 요소:', document.getElementById('payment-method'))
        console.log('agreement 요소:', document.getElementById('agreement'))
        
        await widgets.renderPaymentMethods({
          selector: "#payment-method",
          variantKey: "DEFAULT",
        })
        console.log('결제 수단 UI 렌더링 완료')
        setPaymentMethodsLoaded(true)
        
        await widgets.renderAgreement({
          selector: "#agreement",
          variantKey: "AGREEMENT",
        })
        console.log('이용약관 UI 렌더링 완료')
        
        console.log('결제 UI 렌더링 완료')
      } catch (renderError) {
        console.error('결제 UI 렌더링 오류:', renderError)
        toast({
          title: "결제 UI 렌더링 실패",
          description: "결제 UI를 불러올 수 없습니다. 페이지를 새로고침 후 다시 시도해주세요.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('토스페이먼츠 위젯 초기화 실패:', error)
      toast({
        title: "결제 시스템 초기화 실패",
        description: "잠시 후 다시 시도해주세요.",
        variant: "destructive",
      })
      setIsPaymentModalOpen(false)
    }
  }

  const openPaymentModal = async (planId: string) => {
    if (!user) {
      toast({
        title: "로그인이 필요합니다",
        description: "크레딧을 구매하려면 로그인해주세요.",
        variant: "destructive",
      })
      router.push("/auth/login")
      return
    }
    
    try {
      // 사용자 정보 직접 사용 (auth 정보에서 추출)
      const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || '사용자'
      const userEmail = user.email
      
      // 결제 데이터 생성
      const data = createPaymentData(
        planId,
        user.id,
        userName,
        userEmail
      )

      if (!data) {
        throw new Error('결제 정보를 생성할 수 없습니다.')
      }
      
      setCurrentPlan(planId)
      setPaymentData(data)
      setIsPaymentModalOpen(true)
    } catch (error) {
      console.error('결제 모달 열기 오류:', error)
      toast({
        title: "결제 준비 실패",
        description: error instanceof Error ? error.message : "결제를 시작할 수 없습니다.",
        variant: "destructive",
      })
    }
  }

  const handlePurchase = async () => {
    if (!tossWidgets || !paymentData) {
      toast({
        title: "결제 시스템 초기화 중",
        description: "잠시 후 다시 시도해주세요.",
        variant: "destructive",
      })
      return
    }

    setPurchasing(currentPlan)

    try {
      // 결제 요청 파라미터
      const paymentParams: PaymentParams = {
        orderId: paymentData.orderId,
        orderName: paymentData.orderName,
        successUrl: `${window.location.origin}/dashboard/credits/success`,
        failUrl: `${window.location.origin}/dashboard/credits/fail`,
      }
      
      // 이메일이 있는 경우에만 추가
      if (paymentData.customerEmail) {
        paymentParams.customerEmail = paymentData.customerEmail
      }
      
      // 이름이 있는 경우에만 추가
      if (paymentData.customerName) {
        paymentParams.customerName = paymentData.customerName
      }
      
      console.log('결제 요청 파라미터:', paymentParams)
      
      // 결제 요청
      await tossWidgets.requestPayment(paymentParams)
      
      console.log('결제창 열기 요청 완료')
    } catch (error) {
      console.error('결제 요청 오류:', error)
      toast({
        title: "결제 요청 실패",
        description: error instanceof Error ? error.message : "결제를 시작할 수 없습니다.",
        variant: "destructive",
      })
    } finally {
      setPurchasing(null)
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* 토스페이먼츠 SDK 직접 로드 */}
      <Script
        src="https://js.tosspayments.com/v2/standard"
        strategy="lazyOnload"
        onLoad={() => {
          console.log('토스페이먼츠 SDK 로드 완료')
          setSdkLoaded(true)
        }}
        onError={() => {
          console.error('토스페이먼츠 SDK 로드 실패')
          toast({
            title: "결제 시스템 로드 실패",
            description: "페이지를 새로고침 후 다시 시도해주세요.",
            variant: "destructive",
          })
        }}
      />
      
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
                  onClick={() => openPaymentModal(plan.id)}
                  disabled={purchasing === plan.id || !sdkLoaded}
                >
                  {purchasing === plan.id ? "처리 중..." : "결제하기"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12 text-sm text-gray-500">
          <p>모든 가격은 부가세를 포함합니다. 구매한 크레딧은 만료되지 않습니다.</p>
        </div>
      </div>
      
      {/* 결제 모달 */}
      <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>결제 진행</DialogTitle>
            <DialogDescription>
              결제 수단을 선택하고 결제하기 버튼을 클릭하세요.
            </DialogDescription>
          </DialogHeader>
          
          {/* 결제 UI */}
          <div id="payment-method" ref={paymentMethodRef} className="mt-4 min-h-[200px] border rounded-md p-4">
            {!paymentMethodsLoaded && (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-2">결제 수단 로딩 중...</span>
              </div>
            )}
          </div>
          
          {/* 이용약관 UI */}
          <div id="agreement" ref={agreementRef} className="mt-4 min-h-[100px]"></div>
          
          <div className="mt-6 flex justify-end">
            <Button 
              onClick={handlePurchase}
              disabled={purchasing !== null || !tossWidgets}
            >
              {purchasing ? "처리 중..." : "결제하기"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
