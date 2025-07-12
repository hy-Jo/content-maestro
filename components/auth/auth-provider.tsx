"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import type { User, Session } from "@supabase/supabase-js"
import { addInitialCredits } from "@/lib/credits"

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

  // 초기 크레딧 추가
  const setupInitialCredits = async (userId: string) => {
    try {
      console.log('초기 크레딧 설정 시도:', userId)
      
      // 이미 크레딧 정보가 있는지 확인
      const { data: existingCredits, error: checkError } = await supabase
        .from('user_credits')
        .select('id, credits')
        .eq('id', userId)
        .single()
      
      if (checkError && checkError.code === 'PGRST116') {
        console.log('사용자 크레딧 정보가 없어 초기 크레딧을 생성합니다:', userId)
        
        // 초기 크레딧 추가 (10개)
        const success = await addInitialCredits(userId, 10)
        
        if (success) {
          console.log('초기 크레딧 추가 성공')
        } else {
          console.error('초기 크레딧 추가 실패')
        }
      } else if (checkError) {
        console.error('크레딧 정보 확인 오류:', JSON.stringify(checkError, null, 2))
      } else {
        console.log('이미 크레딧 정보가 있음:', existingCredits)
      }
    } catch (error) {
      console.error('초기 크레딧 설정 중 오류:', error)
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
        
        // 로그인 상태이면 초기 크레딧 확인 및 추가
        if (session?.user) {
          await setupInitialCredits(session.user.id)
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
      
      // 로그인 상태 변경 시 초기 크레딧 확인 및 추가
      if (session?.user) {
        await setupInitialCredits(session.user.id)
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