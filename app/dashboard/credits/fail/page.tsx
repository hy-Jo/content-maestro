"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"

export default function PaymentFailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const errorCode = searchParams.get("code") || "UNKNOWN_ERROR"
  const errorMessage = searchParams.get("message") || "알 수 없는 오류가 발생했습니다."
  const orderId = searchParams.get("orderId")

  return (
    <div className="container mx-auto px-4 py-12 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-center">결제 실패</CardTitle>
          <CardDescription className="text-center">
            결제 처리 중 문제가 발생했습니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <div className="bg-red-100 rounded-full p-4 mb-4">
            <AlertTriangle className="h-12 w-12 text-red-500" />
          </div>
          
          <div className="text-center mt-4 space-y-2">
            <p className="font-medium">오류 코드: {errorCode}</p>
            <p>{errorMessage}</p>
            {orderId && <p className="text-sm text-gray-500">주문 ID: {orderId}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <Button variant="outline" onClick={() => router.push("/pricing")}>
            다시 시도
          </Button>
          <Button onClick={() => router.push("/dashboard")}>
            대시보드로 이동
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
} 