import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/auth';
import { paymentPlans } from '@/lib/toss-payments';

export async function POST(request: NextRequest) {
  try {
    const { paymentKey, orderId, amount } = await request.json();

    if (!paymentKey || !orderId || !amount) {
      return NextResponse.json(
        { success: false, message: '필수 결제 정보가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 토스페이먼츠 API로 결제 검증
    const secretKey = process.env.TOSS_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json(
        { success: false, message: '결제 시크릿 키가 설정되지 않았습니다.' },
        { status: 500 }
      );
    }

    const url = 'https://api.tosspayments.com/v2/payments/confirm';
    const basicAuth = Buffer.from(`${secretKey}:`).toString('base64');

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentKey,
        orderId,
        amount,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: result.message || '결제 검증에 실패했습니다.' },
        { status: 400 }
      );
    }

    // orderId에서 정보 추출
    const parts = orderId.split('_');
    if (parts.length < 3) {
      return NextResponse.json(
        { success: false, message: '유효하지 않은 주문 ID입니다.' },
        { status: 400 }
      );
    }

    const planId = parts[1];
    const userId = parts[2];
    const plan = paymentPlans[planId];

    if (!plan) {
      return NextResponse.json(
        { success: false, message: '유효하지 않은 플랜 ID입니다.' },
        { status: 400 }
      );
    }

    // 서버 컴포넌트에서 Supabase 클라이언트 생성
    const supabase = createClient();

    // 사용자의 현재 크레딧 조회
    const { data: userData, error: userError } = await supabase
      .from('user_credits')
      .select('credits')
      .eq('id', userId)
      .single();

    if (userError) {
      return NextResponse.json(
        { success: false, message: '사용자 크레딧 정보를 조회할 수 없습니다.' },
        { status: 400 }
      );
    }

    const currentCredits = userData.credits || 0;
    const newCredits = currentCredits + plan.credits;

    // 크레딧 업데이트
    const { error: updateError } = await supabase
      .from('user_credits')
      .update({ 
        credits: newCredits, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', userId);

    if (updateError) {
      return NextResponse.json(
        { success: false, message: '크레딧 업데이트에 실패했습니다.' },
        { status: 500 }
      );
    }

    // 거래 내역 추가
    const { error: transactionError } = await supabase
      .from('credit_transactions')
      .insert({
        user_id: userId,
        amount: plan.credits, // 양수로 저장 (충전)
        description: `${plan.name} 구매 (${plan.credits}개 크레딧)`
      });

    if (transactionError) {
      console.error('거래 내역 추가 오류:', transactionError);
      // 거래 내역 추가 실패해도 크레딧은 이미 추가됨
    }

    return NextResponse.json({ 
      success: true, 
      message: `${plan.credits}개의 크레딧이 성공적으로 추가되었습니다.` 
    });
  } catch (error) {
    console.error('결제 확인 오류:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : '결제 처리 중 오류가 발생했습니다.' 
      },
      { status: 500 }
    );
  }
} 