import { supabase } from './supabase'

export type UserCredits = {
  id: string
  credits: number
  created_at: string
  updated_at: string
}

export type CreditTransaction = {
  id: string
  user_id: string
  amount: number
  description: string
  created_at: string
  content_generations_id?: string // Supabase 컬럼명과 일치
}

/**
 * 사용자의 현재 크레딧을 조회합니다.
 */
export async function getUserCredits(): Promise<number> {
  try {
    // 현재 사용자 ID 가져오기
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('인증된 사용자를 찾을 수 없습니다.');
      return 0;
    }

    // 사용자 크레딧 조회
    const { data, error } = await supabase
      .from('user_credits')
      .select('credits')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('크레딧 조회 오류:', error);
      return 0;
    }

    return data?.credits || 0;
  } catch (error) {
    console.error('크레딧 조회 중 오류 발생:', error);
    return 0;
  }
}

/**
 * 회원가입 시 초기 크레딧을 추가합니다.
 * @param userId 사용자 ID
 * @param amount 초기 크레딧 양
 */
export async function addInitialCredits(userId: string, amount: number = 10): Promise<boolean> {
  try {
    // 크레딧 추가
    const { error: creditError } = await supabase
      .from('user_credits')
      .insert({
        id: userId,
        credits: amount,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })

    if (creditError) {
      console.error('초기 크레딧 추가 오류:', creditError)
      return false
    }

    // 거래 내역 추가
    const { error: transactionError } = await supabase
      .from('credit_transactions')
      .insert({
        user_id: userId,
        amount: amount, // 양수로 저장 (충전)
        description: '회원가입 보너스 크레딧'
      })

    if (transactionError) {
      console.error('초기 크레딧 거래 내역 추가 오류:', transactionError)
      // 거래 내역 추가 실패해도 크레딧은 이미 추가됨
    }

    return true
  } catch (error) {
    console.error('초기 크레딧 설정 오류:', error)
    return false
  }
}

/**
 * 사용자의 크레딧을 사용합니다.
 * @param amount 사용할 크레딧 양 (양수)
 * @param description 사용 내역 설명
 * @param contentGenerationsId content_generations 테이블의 id (선택사항)
 * @returns 성공 여부와 남은 크레딧
 */
export async function useCredits(
  amount: number, 
  description: string, 
  contentGenerationsId?: string
): Promise<{ success: boolean; remainingCredits: number }> {
  // 크레딧 양은 양수여야 합니다
  if (amount <= 0) {
    return { success: false, remainingCredits: 0 }
  }

  // 현재 사용자 ID 가져오기
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, remainingCredits: 0 }
  }

  // 현재 크레딧 조회
  const { data: creditData, error: creditError } = await supabase
    .from('user_credits')
    .select('credits')
    .eq('id', user.id)
    .single()

  if (creditError || !creditData) {
    console.error('크레딧 조회 오류:', creditError)
    return { success: false, remainingCredits: 0 }
  }

  const currentCredits = creditData.credits

  // 크레딧이 충분한지 확인
  if (currentCredits < amount) {
    return { success: false, remainingCredits: currentCredits }
  }

  // 트랜잭션 시작
  const newCredits = currentCredits - amount

  // 크레딧 업데이트
  const { error: updateError } = await supabase
    .from('user_credits')
    .update({ credits: newCredits, updated_at: new Date().toISOString() })
    .eq('id', user.id)

  if (updateError) {
    console.error('크레딧 업데이트 오류:', updateError)
    return { success: false, remainingCredits: currentCredits }
  }

  // 거래 내역 추가
  const transactionData: any = {
    user_id: user.id,
    amount: -amount, // 음수로 저장 (사용)
    description
  }
  
  // content_generations_id가 있으면 추가
  if (contentGenerationsId) {
    transactionData.content_generations_id = contentGenerationsId
  }

  const { error: transactionError } = await supabase
    .from('credit_transactions')
    .insert(transactionData)

  if (transactionError) {
    console.error('거래 내역 추가 오류:', transactionError)
    // 거래 내역 추가 실패해도 크레딧은 이미 차감됨
  }

  return { success: true, remainingCredits: newCredits }
}

/**
 * 사용자의 크레딧 거래 내역을 조회합니다.
 */
export async function getCreditTransactions(): Promise<CreditTransaction[]> {
  const { data, error } = await supabase
    .from('credit_transactions')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('거래 내역 조회 오류:', error)
    return []
  }

  return data || []
} 