"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase"
import { paymentPlans } from "@/lib/toss-payments"

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  
  const [isLoading, setIsLoading] = useState(true)
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null)

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // URL 파라미터 가져오기
        const paymentKey = searchParams.get("paymentKey")
        const orderId = searchParams.get("orderId")
        const amount = searchParams.get("amount")

        console.log('결제 검증 시작:', { paymentKey, orderId, amount })

        if (!paymentKey || !orderId) {
          throw new Error("결제 정보가 올바르지 않습니다.")
        }

        // 주문 ID에서 정보 추출
        const orderParts = orderId.split('_')
        if (orderParts.length < 3) {
          throw new Error("유효하지 않은 주문 ID입니다.")
        }

        const planId = orderParts[1]
        const userId = orderParts[2]
        
        // 플랜 정보 확인
        const plan = paymentPlans[planId]
        if (!plan) {
          throw new Error("유효하지 않은 플랜입니다.")
        }
        
        // 현재 사용자 확인
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          throw new Error("사용자 정보를 확인할 수 없습니다.")
        }
        
        if (user.id !== userId) {
          throw new Error("주문 정보가 현재 사용자와 일치하지 않습니다.")
        }
        
        console.log('사용자 확인 완료:', user.id)
        
        // 사용자의 현재 크레딧 조회
        const { data: userData, error: userError } = await supabase
          .from('user_credits')
          .select('credits')
          .eq('id', userId)
          .single()
          
        if (userError) {
          console.error('사용자 크레딧 조회 오류:', userError)
          throw new Error("사용자 크레딧 정보를 조회할 수 없습니다.")
        }
        
        const currentCredits = userData?.credits || 0
        const newCredits = currentCredits + plan.credits
        
        console.log('크레딧 업데이트 예정:', { 현재: currentCredits, 추가: plan.credits, 새로운값: newCredits })
        
        // 크레딧 업데이트
        const { error: updateError } = await supabase
          .from('user_credits')
          .update({ 
            credits: newCredits, 
            updated_at: new Date().toISOString() 
          })
          .eq('id', userId)
          
        if (updateError) {
          console.error('크레딧 업데이트 오류:', updateError)
          throw new Error("크레딧 업데이트에 실패했습니다.")
        }
        
        console.log('크레딧 업데이트 완료')
        
        // 거래 내역 추가
        const { data: transactionData, error: transactionError } = await supabase
          .from('credit_transactions')
          .insert({
            user_id: userId,
            amount: plan.credits,
            description: `${plan.name} 구매 (${plan.credits}개 크레딧)`
          })
          .select()
          
        if (transactionError) {
          console.error('거래 내역 추가 오류:', transactionError)
          // 거래 내역 추가 실패해도 크레딧은 이미 추가됨
        } else {
          console.log('거래 내역 추가 완료:', transactionData)
        }
        
        setResult({
          success: true,
          message: `${plan.credits}개의 크레딧이 성공적으로 추가되었습니다.`,
        })

        // 성공 메시지 표시
        toast({
          title: "결제 성공",
          description: `${plan.credits}개의 크레딧이 계정에 추가되었습니다.`,
        })
      } catch (error) {
        console.error("결제 검증 오류:", error)
        setResult({
          success: false,
          message: error instanceof Error ? error.message : "결제 검증 중 오류가 발생했습니다.",
        })

        // 오류 메시지 표시
        toast({
          title: "결제 검증 실패",
          description: error instanceof Error ? error.message : "결제 검증 중 오류가 발생했습니다.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    verifyPayment()
  }, [searchParams, toast])

  // 대시보드로 돌아가기
  const goToDashboard = () => {
    router.push("/dashboard/credits")
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-center">
            {isLoading ? "결제 확인 중..." : (result?.success ? "결제 완료" : "결제 오류")}
          </CardTitle>
          <CardDescription className="text-center">
            {isLoading ? "잠시만 기다려주세요..." : ""}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          {isLoading ? (
            <div className="animate-pulse h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : result?.success ? (
            <div className="bg-green-100 rounded-full p-4 mb-4">
              <Check className="h-12 w-12 text-green-500" />
            </div>
          ) : (
            <div className="bg-red-100 rounded-full p-4 mb-4">
              <div className="h-12 w-12 text-red-500 flex items-center justify-center">
                <span className="text-2xl font-bold">!</span>
              </div>
            </div>
          )}
          
          <p className="text-center mt-4">
            {result?.message}
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={goToDashboard}>
            크레딧 내역 확인
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
} 