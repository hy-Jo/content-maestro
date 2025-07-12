import OpenAI from 'openai';

// OpenAI 클라이언트 초기화
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * 블로그 콘텐츠 생성 함수
 * @param topic 블로그 주제 또는 제목
 * @returns 생성된 블로그 콘텐츠와 SEO 팁
 */
export async function generateBlogContent(topic: string): Promise<{
  content: string;
  seoTips: string[];
}> {
  try {
    // GPT-4o를 사용하여 블로그 콘텐츠 생성
    const contentCompletion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `당신은 전문적인 블로그 콘텐츠 작성자입니다. 
          주어진 주제나 제목에 대해 고품질의 블로그 포스트를 마크다운 형식으로 작성해주세요.
          포스트는 다음 구조를 따라야 합니다:
          1. 매력적인 제목 (H1)
          2. 간결한 소개 (2-3문장)
          3. 주요 섹션 (H2 제목과 내용)
          4. 하위 섹션 (필요시 H3 제목과 내용)
          5. 실용적인 팁이나 예시
          6. 결론
          
          블로그 포스트는 약 800-1200단어 분량으로 작성해주세요.
          전문적이면서도 친근한 어조를 유지하고, 독자의 관심을 끌 수 있는 흥미로운 내용을 포함하세요.
          마크다운 형식을 사용하여 제목, 강조, 목록 등을 적절히 활용해주세요.`
        },
        {
          role: 'user',
          content: `"${topic}"에 대한 블로그 포스트를 작성해주세요.`
        }
      ],
      temperature: 0.7,
      max_tokens: 2500,
    });

    // SEO 팁 생성
    const seoCompletion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `당신은 SEO 전문가입니다. 
          주어진 블로그 주제에 대해 검색 엔진 최적화를 위한 구체적이고 실용적인 팁을 5-7개 제공해주세요.
          각 팁은 간결하고 명확하게 작성하되, 실행 가능한 조언이어야 합니다.`
        },
        {
          role: 'user',
          content: `"${topic}"에 대한 블로그 포스트의 SEO 최적화 팁을 제공해주세요.`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    // 결과 추출
    const content = contentCompletion.choices[0]?.message?.content || '';
    
    // SEO 팁 텍스트를 배열로 변환
    const seoTipsText = seoCompletion.choices[0]?.message?.content || '';
    const seoTips = seoTipsText
      .split('\n')
      .filter(line => line.trim().length > 0)
      .map(line => line.replace(/^\d+\.\s*/, '').replace(/^-\s*/, '').trim())
      .filter(tip => tip.length > 10); // 너무 짧은 라인 필터링

    return {
      content,
      seoTips: seoTips.length > 0 ? seoTips : [seoTipsText], // 분리가 안 되면 전체 텍스트를 하나의 팁으로
    };
  } catch (error) {
    console.error('OpenAI API 오류:', error);
    throw new Error('콘텐츠 생성 중 오류가 발생했습니다.');
  }
} 