import { supabaseAdmin } from './supabase-admin';

/**
 * 사용자의 크레딧 정보를 조회합니다. (관리자 권한)
 * @param userId 사용자 ID
 * @returns 크레딧 정보 또는 null
 */
export async function getCreditsAdmin(userId: string) {
  const { data, error } = await supabaseAdmin
    .from('user_credits')
    .select('credits')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('크레딧 조회 오류:', error);
    return null;
  }

  return data;
}

/**
 * 사용자의 크레딧 정보가 없는 경우 초기 크레딧을 생성합니다. (관리자 권한)
 * @param userId 사용자 ID
 * @param initialAmount 초기 크레딧 양
 * @returns 생성된 크레딧 정보 또는 null
 */
export async function createInitialCreditsAdmin(userId: string, initialAmount: number = 10) {
  // 초기 크레딧 추가
  const { error: insertError } = await supabaseAdmin
    .from('user_credits')
    .insert({
      id: userId,
      credits: initialAmount,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  
  if (insertError) {
    console.error('초기 크레딧 생성 오류:', insertError);
    return null;
  }
  
  // 거래 내역 추가
  await supabaseAdmin
    .from('credit_transactions')
    .insert({
      user_id: userId,
      amount: initialAmount,
      description: '회원가입 보너스 크레딧'
    });
  
  // 새로 생성된 크레딧 정보 가져오기
  const { data, error } = await supabaseAdmin
    .from('user_credits')
    .select('credits')
    .eq('id', userId)
    .single();
  
  if (error) {
    console.error('새로 생성된 크레딧 정보 조회 오류:', error);
    return null;
  }
  
  return data;
}

/**
 * 사용자의 크레딧을 차감합니다. (관리자 권한)
 * @param userId 사용자 ID
 * @param amount 차감할 크레딧 양
 * @param description 거래 내역 설명
 * @param contentGenerationId 콘텐츠 생성 ID (선택사항)
 * @returns 업데이트된 크레딧 정보 또는 null
 */
export async function useCreditsAdmin(
  userId: string, 
  amount: number, 
  description: string,
  contentGenerationId?: string
) {
  // 현재 크레딧 조회
  const { data: creditData, error: creditError } = await supabaseAdmin
    .from('user_credits')
    .select('credits')
    .eq('id', userId)
    .single();

  if (creditError || !creditData) {
    console.error('크레딧 조회 오류:', creditError);
    return null;
  }

  const currentCredits = creditData.credits;

  // 크레딧이 충분한지 확인
  if (currentCredits < amount) {
    console.error('크레딧 부족:', { 현재: currentCredits, 필요: amount });
    return null;
  }

  // 크레딧 차감
  const newCredits = currentCredits - amount;
  
  // 크레딧 업데이트
  const { error: updateError } = await supabaseAdmin
    .from('user_credits')
    .update({ 
      credits: newCredits, 
      updated_at: new Date().toISOString() 
    })
    .eq('id', userId);

  if (updateError) {
    console.error('크레딧 차감 오류:', updateError);
    return null;
  }

  // 거래 내역 추가
  const transactionData: any = {
    user_id: userId,
    amount: -amount, // 음수로 저장 (사용)
    description
  };
  
  // contentGenerationId가 있으면 추가
  if (contentGenerationId) {
    transactionData.content_generations_id = contentGenerationId;
  }

  const { error: transactionError } = await supabaseAdmin
    .from('credit_transactions')
    .insert(transactionData);

  if (transactionError) {
    console.error('거래 내역 추가 오류:', transactionError);
    // 거래 내역 추가 실패해도 계속 진행
  }

  return { credits: newCredits };
}

/**
 * 콘텐츠 생성 정보를 저장합니다. (관리자 권한)
 * @param userId 사용자 ID
 * @param topic 주제
 * @param content 생성된 콘텐츠
 * @param seoTips SEO 팁
 * @returns 생성된 콘텐츠 정보 또는 null
 */
export async function saveContentGenerationAdmin(
  userId: string,
  topic: string,
  content: string,
  seoTips: string[]
) {
  const { data, error } = await supabaseAdmin
    .from('content_generations')
    .insert({
      user_id: userId,
      topic: topic,
      content: content,
      seo_tips: seoTips
    })
    .select('id')
    .single();

  if (error) {
    console.error('콘텐츠 생성 정보 저장 오류:', error);
    return null;
  }

  return data;
} 