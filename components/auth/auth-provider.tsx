"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import type { User, Session } from "@supabase/supabase-js"

type AuthContextType = {
  user: User | null
  session: Session | null
  isLoading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // 초기 크레딧 거래 내역 추가
  const addInitialCreditTransaction = async (userId: string) => {
    try {
      console.log('초기 크레딧 거래 내역 추가 시도:', userId)
      
      // 이미 거래 내역이 있는지 확인
      const { data: existingTransactions, error: checkError } = await supabase
        .from('credit_transactions')
        .select('id')
        .eq('user_id', userId)
        .eq('description', '회원가입 보너스 크레딧')
      
      if (checkError) {
        console.error('거래 내역 확인 오류:', JSON.stringify(checkError, null, 2))
        return
      }
      
      if (existingTransactions && existingTransactions.length > 0) {
        console.log('이미 초기 크레딧 거래 내역이 있음:', existingTransactions[0].id)
        // 이미 초기 크레딧 거래 내역이 있으면 중복 추가 방지
        return
      }
      
      console.log('초기 크레딧 거래 내역 추가 중...')
      
      // 거래 내역 추가
      const transactionData = {
        user_id: userId,
        amount: 10, // 양수로 저장 (충전)
        description: '회원가입 보너스 크레딧',
        content_generations_id: null // 명시적으로 null 설정
      }
      
      console.log('추가할 거래 내역 데이터:', transactionData)
      
      const { error: transactionError } = await supabase
        .from('credit_transactions')
        .insert(transactionData)
      
      if (transactionError) {
        console.error('초기 크레딧 거래 내역 추가 오류:', JSON.stringify(transactionError, null, 2))
      } else {
        console.log('초기 크레딧 거래 내역 추가 성공')
      }
    } catch (error) {
      console.error('초기 크레딧 거래 내역 추가 중 오류:', error)
    }
  }

  useEffect(() => {
    const fetchSession = async () => {
      setIsLoading(true)
      
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          throw error
        }
        
        setSession(session)
        setUser(session?.user ?? null)
        
        // 로그인 상태이면 초기 크레딧 거래 내역 확인 및 추가
        if (session?.user) {
          await addInitialCreditTransaction(session.user.id)
        }
      } catch (error) {
        console.error("Error fetching session:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      
      // 로그인 상태 변경 시 초기 크레딧 거래 내역 확인 및 추가
      if (session?.user) {
        await addInitialCreditTransaction(session.user.id)
      }
      
      setIsLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  const value = {
    user,
    session,
    isLoading,
    signOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  
  return context
} 