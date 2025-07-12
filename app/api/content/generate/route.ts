import { NextRequest, NextResponse } from 'next/server';
import { generateBlogContent } from '@/lib/openai';
import { supabase } from '@/lib/supabase';
import { 
  getCreditsAdmin, 
  createInitialCreditsAdmin, 
  useCreditsAdmin, 
  saveContentGenerationAdmin 
} from '@/lib/admin-credits';

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

    // 사용자 크레딧 확인
    let creditData = await getCreditsAdmin(user.id);
    console.log('크레딧 조회 결과:', creditData);

    // 크레딧 정보가 없는 경우 - 회원가입 시 초기 크레딧이 제대로 추가되지 않았을 수 있음
    if (!creditData) {
      console.log('사용자의 크레딧 정보가 없습니다. 초기 크레딧을 생성합니다.');
      
      // 초기 크레딧 생성
      creditData = await createInitialCreditsAdmin(user.id, 10);
      
      if (!creditData) {
        return NextResponse.json(
          { error: '크레딧 정보를 생성할 수 없습니다.' },
          { status: 500 }
        );
      }
      
      console.log('새로 생성된 크레딧 정보:', creditData);
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
    const contentGeneration = await saveContentGenerationAdmin(user.id, topic, content, seoTips);
    
    if (!contentGeneration) {
      return NextResponse.json(
        { error: '콘텐츠 생성 정보를 저장할 수 없습니다.' },
        { status: 500 }
      );
    }

    // 크레딧 차감
    const updatedCredits = await useCreditsAdmin(
      user.id, 
      1, 
      `콘텐츠 생성: ${topic}`,
      contentGeneration.id
    );
    
    if (!updatedCredits) {
      return NextResponse.json(
        { error: '크레딧을 차감할 수 없습니다.' },
        { status: 500 }
      );
    }

    console.log('콘텐츠 생성 완료, 남은 크레딧:', updatedCredits.credits);

    // 결과 반환
    return NextResponse.json({
      content,
      seoTips,
      remainingCredits: updatedCredits.credits,
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