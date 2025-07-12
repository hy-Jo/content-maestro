import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/auth';
import { paymentPlans } from '@/lib/toss-payments';

export async function POST(request: NextRequest) {
  try {
    // 요청 본문 파싱
    let requestBody;
    try {
      requestBody = await request.json();
    } catch (parseError) {
      console.error('요청 본문 파싱 오류:', parseError);
      return NextResponse.json(
        { success: false, message: '유효하지 않은 요청 형식입니다.' },
        { status: 400 }
      );
    }

    const { paymentKey, orderId, amount } = requestBody;

    if (!paymentKey || !orderId || !amount) {
      return NextResponse.json(
        { success: false, message: '필수 결제 정보가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 토스페이먼츠 API로 결제 검증
    // 환경 변수에서 시크릿 키 가져오기
    const secretKey = process.env.TOSS_SECRET_KEY;
    
    if (!secretKey) {
      console.error('토스페이먼츠 시크릿 키가 설정되지 않았습니다.');
      return NextResponse.json(
        { success: false, message: '결제 시스템 설정이 올바르지 않습니다. 관리자에게 문의하세요.' },
        { status: 500 }
      );
    }
    
    console.log('토스페이먼츠 시크릿 키 사용 여부:', '설정됨 (마스킹됨)');
    
    const url = 'https://api.tosspayments.com/v2/payments/confirm';
    const basicAuth = Buffer.from(`${secretKey}:`).toString('base64');

    let response;
    let result;
    
    try {
      console.log('토스페이먼츠 API 요청 시작:', {
        paymentKey,
        orderId,
        amount,
      });
      
      response = await fetch(url, {
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
      
      console.log('토스페이먼츠 API 응답 상태:', response.status, response.statusText);
      
      const responseText = await response.text();
      console.log('토스페이먼츠 API 응답 본문 길이:', responseText.length);
      console.log('토스페이먼츠 API 응답 본문 미리보기:', 
        responseText.length > 100 ? responseText.substring(0, 100) + '...' : responseText || '(빈 응답)');
      
      // 빈 응답 처리
      if (!responseText || responseText.trim() === '') {
        console.error('토스페이먼츠 API에서 빈 응답을 반환했습니다.');
        return NextResponse.json(
          { success: false, message: '결제 서비스에서 응답을 받지 못했습니다.' },
          { status: 500 }
        );
      }
      
      try {
        result = JSON.parse(responseText);
      } catch (jsonError) {
        console.error('토스페이먼츠 API 응답 JSON 파싱 오류:', jsonError);
        console.error('파싱 실패한 응답 본문:', responseText);
        return NextResponse.json(
          { success: false, message: '결제 서비스의 응답을 처리할 수 없습니다.' },
          { status: 500 }
        );
      }
    } catch (apiError) {
      console.error('토스페이먼츠 API 호출 오류:', apiError);
      return NextResponse.json(
        { success: false, message: '결제 서비스와 통신 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    if (!response.ok) {
      console.error('토스페이먼츠 API 오류 응답:', result);
      return NextResponse.json(
        { success: false, message: result?.message || '결제 검증에 실패했습니다.' },
        { status: response.status || 400 }
      );
    }

    // 응답이 비어있는지 확인
    if (!result) {
      console.error('토스페이먼츠 API 응답이 비어있습니다.');
      return NextResponse.json(
        { success: false, message: '결제 서비스에서 유효한 응답을 받지 못했습니다.' },
        { status: 500 }
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
    let userData;
    try {
      const { data, error } = await supabase
        .from('user_credits')
        .select('credits')
        .eq('id', userId)
        .single();
        
      if (error) {
        throw error;
      }
      
      userData = data;
    } catch (dbError) {
      console.error('사용자 크레딧 조회 오류:', dbError);
      return NextResponse.json(
        { success: false, message: '사용자 크레딧 정보를 조회할 수 없습니다.' },
        { status: 400 }
      );
    }

    const currentCredits = userData.credits || 0;
    const newCredits = currentCredits + plan.credits;

    // 크레딧 업데이트
    try {
      const { error } = await supabase
        .from('user_credits')
        .update({ 
          credits: newCredits, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', userId);
        
      if (error) {
        throw error;
      }
    } catch (updateError) {
      console.error('크레딧 업데이트 오류:', updateError);
      return NextResponse.json(
        { success: false, message: '크레딧 업데이트에 실패했습니다.' },
        { status: 500 }
      );
    }

    // 거래 내역 추가
    try {
      const { error } = await supabase
        .from('credit_transactions')
        .insert({
          user_id: userId,
          amount: plan.credits, // 양수로 저장 (충전)
          description: `${plan.name} 구매 (${plan.credits}개 크레딧)`
        });
        
      if (error) {
        console.error('거래 내역 추가 오류:', error);
        // 거래 내역 추가 실패해도 크레딧은 이미 추가됨
      }
    } catch (transactionError) {
      console.error('거래 내역 추가 예외:', transactionError);
      // 거래 내역 추가 실패해도 계속 진행
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