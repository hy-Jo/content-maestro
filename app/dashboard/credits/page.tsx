"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CreditCard, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { getCreditTransactions, getUserCredits, type CreditTransaction } from "@/lib/credits"
import { format } from "date-fns"

export default function CreditsPage() {
  const [transactions, setTransactions] = useState<CreditTransaction[]>([])
  const [credits, setCredits] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      const [userCredits, userTransactions] = await Promise.all([
        getUserCredits(),
        getCreditTransactions()
      ])
      
      setCredits(userCredits)
      setTransactions(userTransactions)
      setIsLoading(false)
    }

    loadData()
  }, [])

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">크레딧 관리</h1>
      
      <div className="grid md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>현재 크레딧</CardDescription>
            <CardTitle className="text-3xl flex items-center">
              <CreditCard className="mr-2 h-5 w-5" />
              {isLoading ? "로딩 중..." : credits}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>크레딧 사용 내역</CardTitle>
          <CardDescription>
            크레딧 획득 및 사용 내역을 확인할 수 있습니다
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
            </div>
          ) : transactions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>날짜</TableHead>
                  <TableHead>내용</TableHead>
                  <TableHead className="text-right">크레딧</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">
                      {format(new Date(transaction.created_at), 'yyyy-MM-dd HH:mm')}
                    </TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={transaction.amount > 0 ? "default" : "outline"} className="ml-auto">
                        {transaction.amount > 0 ? (
                          <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
                        ) : (
                          <ArrowDownRight className="mr-1 h-3 w-3 text-red-500" />
                        )}
                        {transaction.amount > 0 ? `+${transaction.amount}` : transaction.amount}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>크레딧 사용 내역이 없습니다</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 