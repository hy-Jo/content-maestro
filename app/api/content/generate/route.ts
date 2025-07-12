import { NextRequest, NextResponse } from 'next/server';
import { generateBlogContent } from '@/lib/openai';
import { supabase } from '@/lib/supabase';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(req: NextRequest) {
  try {
    // 요청 본문에서 주제 추출
    const { topic } = await req.json();

    if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
      return NextResponse.json(
        { error: '유효한 주제를 입력해주세요.' },
        { status: 400 }
      );
    }

    // 인증 헤더에서 토큰 추출
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: '인증되지 않은 요청입니다.' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');

    // 토큰으로 사용자 인증
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.error('인증 오류:', authError);
      return NextResponse.json(
        { error: '인증되지 않은 사용자입니다.' },
        { status: 401 }
      );
    }

    console.log('인증된 사용자:', user.id);

    // 사용자 크레딧 확인 - 디버깅 로그 추가
    const { data: creditData, error: creditError } = await supabaseAdmin
      .from('user_credits')
      .select('credits')
      .eq('id', user.id)
      .single();

    console.log('크레딧 조회 결과:', { data: creditData, error: creditError });

    // 크레딧 정보가 없는 경우 - 회원가입 시 초기 크레딧이 제대로 추가되지 않았을 수 있음
    if (creditError && creditError.code === 'PGRST116') {
      console.log('사용자의 크레딧 정보가 없습니다. 초기 크레딧을 생성합니다.');
      
      // 초기 크레딧 추가 (10개)
      const { error: insertError } = await supabaseAdmin
        .from('user_credits')
        .insert({
          id: user.id,
          credits: 10,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      
      if (insertError) {
        console.error('초기 크레딧 생성 오류:', insertError);
        return NextResponse.json(
          { error: '크레딧 정보를 생성할 수 없습니다.' },
          { status: 500 }
        );
      }
      
      // 거래 내역 추가
      await supabaseAdmin
        .from('credit_transactions')
        .insert({
          user_id: user.id,
          amount: 10,
          description: '회원가입 보너스 크레딧'
        });
      
      // 새로 생성된 크레딧 정보 가져오기
      const { data: newCreditData, error: newCreditError } = await supabaseAdmin
        .from('user_credits')
        .select('credits')
        .eq('id', user.id)
        .single();
      
      if (newCreditError || !newCreditData) {
        console.error('새로 생성된 크레딧 정보 조회 오류:', newCreditError);
        return NextResponse.json(
          { error: '크레딧 정보를 가져올 수 없습니다.' },
          { status: 500 }
        );
      }
      
      console.log('새로 생성된 크레딧 정보:', newCreditData);
      
      // 새로 생성된 크레딧 정보 사용
      const creditToUse = newCreditData;
      
      // OpenAI API를 사용하여 콘텐츠 생성
      const { content, seoTips } = await generateBlogContent(topic);
      
      // 콘텐츠 생성 정보 저장
      const { data: contentGeneration, error: contentError } = await supabaseAdmin
        .from('content_generations')
        .insert({
          user_id: user.id,
          topic: topic,
          content: content,
          seo_tips: seoTips
        })
        .select('id')
        .single();
      
      if (contentError || !contentGeneration) {
        console.error('콘텐츠 생성 정보 저장 오류:', contentError);
        return NextResponse.json(
          { error: '콘텐츠 생성 정보를 저장할 수 없습니다.' },
          { status: 500 }
        );
      }
      
      // 크레딧 차감
      const newCredits = creditToUse.credits - 1;
      
      // 크레딧 업데이트
      const { error: updateError } = await supabaseAdmin
        .from('user_credits')
        .update({ 
          credits: newCredits, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', user.id);
      
      if (updateError) {
        console.error('크레딧 차감 오류:', updateError);
        return NextResponse.json(
          { error: '크레딧을 차감할 수 없습니다.' },
          { status: 500 }
        );
      }
      
      // 거래 내역 추가
      await supabaseAdmin
        .from('credit_transactions')
        .insert({
          user_id: user.id,
          amount: -1,
          description: `콘텐츠 생성: ${topic}`,
          content_generations_id: contentGeneration.id
        });
      
      // 결과 반환
      return NextResponse.json({
        content,
        seoTips,
        remainingCredits: newCredits,
        contentGenerationId: contentGeneration.id
      });
    } else if (creditError) {
      console.error('크레딧 조회 오류:', creditError);
      return NextResponse.json(
        { error: '크레딧 정보를 가져올 수 없습니다.' },
        { status: 500 }
      );
    } else if (!creditData) {
      console.error('크레딧 데이터가 null입니다.');
      return NextResponse.json(
        { error: '크레딧 정보가 없습니다. 크레딧을 구매해주세요.' },
        { status: 403 }
      );
    }

    if (creditData.credits <= 0) {
      return NextResponse.json(
        { error: '크레딧이 부족합니다. 크레딧을 구매해주세요.' },
        { status: 403 }
      );
    }

    console.log('사용 가능한 크레딧:', creditData.credits);

    // OpenAI API를 사용하여 콘텐츠 생성
    const { content, seoTips } = await generateBlogContent(topic);

    // 콘텐츠 생성 정보 저장
    const { data: contentGeneration, error: contentError } = await supabaseAdmin
      .from('content_generations')
      .insert({
        user_id: user.id,
        topic: topic,
        content: content,
        seo_tips: seoTips
      })
      .select('id')
      .single();

    if (contentError || !contentGeneration) {
      console.error('콘텐츠 생성 정보 저장 오류:', contentError);
      return NextResponse.json(
        { error: '콘텐츠 생성 정보를 저장할 수 없습니다.' },
        { status: 500 }
      );
    }

    // 크레딧 차감
    const newCredits = creditData.credits - 1;
    
    // 크레딧 업데이트
    const { error: updateError } = await supabaseAdmin
      .from('user_credits')
      .update({ 
        credits: newCredits, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('크레딧 차감 오류:', updateError);
      return NextResponse.json(
        { error: '크레딧을 차감할 수 없습니다.' },
        { status: 500 }
      );
    }

    // 거래 내역 추가
    const { error: transactionError } = await supabaseAdmin
      .from('credit_transactions')
      .insert({
        user_id: user.id,
        amount: -1, // 음수로 저장 (사용)
        description: `콘텐츠 생성: ${topic}`,
        content_generations_id: contentGeneration.id
      });

    if (transactionError) {
      console.error('거래 내역 추가 오류:', transactionError);
      // 거래 내역 추가 실패해도 계속 진행
    }

    console.log('콘텐츠 생성 완료, 남은 크레딧:', newCredits);

    // 결과 반환
    return NextResponse.json({
      content,
      seoTips,
      remainingCredits: newCredits,
      contentGenerationId: contentGeneration.id
    });

  } catch (error) {
    console.error('콘텐츠 생성 API 오류:', error);
    return NextResponse.json(
      { error: '콘텐츠 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 