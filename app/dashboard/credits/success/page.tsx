"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

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
        const paymentKey = searchParams.get("paymentKey")
        const orderId = searchParams.get("orderId")
        const amount = searchParams.get("amount")

        if (!paymentKey || !orderId || !amount) {
          throw new Error("결제 정보가 올바르지 않습니다.")
        }

        // API 엔드포인트를 통해 결제 검증 요청
        const response = await fetch('/api/payments/confirm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentKey,
            orderId,
            amount: parseInt(amount, 10),
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || '결제 검증에 실패했습니다.')
        }

        setResult({
          success: true,
          message: data.message || '결제가 성공적으로 처리되었습니다.',
        })

        // 성공 메시지 표시
        toast({
          title: "결제 성공",
          description: data.message || '크레딧이 계정에 추가되었습니다.',
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
          <Button onClick={() => router.push("/dashboard/credits")}>
            크레딧 내역 확인
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
} 