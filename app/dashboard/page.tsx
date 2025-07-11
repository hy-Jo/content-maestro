"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Sparkles, CreditCard, Target, FileText, TrendingUp, LogOut, Plus, History } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { getUserCredits, useCredits } from "@/lib/credits"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase"

export default function DashboardPage() {
  const { signOut, user } = useAuth()
  const { toast } = useToast()
  const [topic, setTopic] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState("")
  const [seoTips, setSeoTips] = useState<string[]>([])
  const [credits, setCredits] = useState<number>(0)
  const [isLoadingCredits, setIsLoadingCredits] = useState(true)

  // 사용자 크레딧 로드
  useEffect(() => {
    async function loadCredits() {
      if (user) {
        setIsLoadingCredits(true)
        const userCredits = await getUserCredits()
        setCredits(userCredits)
        setIsLoadingCredits(false)
      }
    }

    loadCredits()
  }, [user])

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast({
        title: "주제를 입력해주세요",
        variant: "destructive",
      })
      return
    }

    if (credits <= 0) {
      toast({
        title: "크레딧이 부족합니다",
        description: "크레딧을 구매해주세요.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    // 실제 AI 생성 로직 시뮬레이션
    setTimeout(async () => {
      try {
        const mockContent = `# ${topic}에 대한 완벽 가이드

${topic}는 현대 사회에서 매우 중요한 주제입니다. 이 글에서는 ${topic}에 대해 자세히 알아보고, 실용적인 팁과 인사이트를 제공하겠습니다.

## ${topic}란 무엇인가?

${topic}는 다양한 관점에서 접근할 수 있는 복합적인 개념입니다. 기본적으로 ${topic}는...

## ${topic}의 중요성

1. **효율성 향상**: ${topic}를 제대로 이해하면 업무 효율성이 크게 향상됩니다.
2. **경쟁력 강화**: 현대 비즈니스 환경에서 ${topic}는 필수적인 요소입니다.
3. **미래 대비**: ${topic}에 대한 이해는 미래를 준비하는 데 도움이 됩니다.

## 실용적인 ${topic} 활용법

### 1단계: 기초 이해하기
${topic}의 기본 개념을 정확히 파악하는 것이 중요합니다.

### 2단계: 실습하기
이론만으로는 부족합니다. 직접 ${topic}를 실습해보세요.

### 3단계: 응용하기
기본기를 익혔다면 이제 실제 상황에 응용해보세요.

## 결론

${topic}는 단순한 개념이 아닙니다. 지속적인 학습과 실습을 통해 마스터할 수 있는 영역입니다. 이 가이드가 여러분의 ${topic} 여정에 도움이 되기를 바랍니다.`

        const mockSeoTips = [
          `"${topic}" 키워드를 제목과 첫 번째 문단에 포함하세요`,
          `"${topic} 가이드", "${topic} 방법", "${topic} 팁" 등의 롱테일 키워드를 활용하세요`,
          "메타 디스크립션을 150-160자로 작성하세요",
          "이미지에 alt 텍스트를 추가하세요",
          "내부 링크를 2-3개 추가하여 SEO 점수를 높이세요",
          "소제목(H2, H3)을 활용하여 구조화하세요",
        ]

        // 콘텐츠 생성 정보 저장
        const { data: contentGeneration, error: contentError } = await supabase
          .from('content_generations')
          .insert({
            user_id: user?.id,
            topic: topic,
            content: mockContent,
            seo_tips: mockSeoTips
          })
          .select('id')
          .single()

        if (contentError) {
          console.error('콘텐츠 생성 정보 저장 오류:', contentError)
          toast({
            title: "콘텐츠 생성 실패",
            description: "콘텐츠 생성 정보를 저장하는 중 오류가 발생했습니다.",
            variant: "destructive",
          })
          setIsGenerating(false)
          return
        }

        // 크레딧 사용 (contentGenerationId 전달)
        const { success, remainingCredits } = await useCredits(
          1, 
          `콘텐츠 생성: ${topic}`, 
          contentGeneration?.id
        )

        if (success) {
          setGeneratedContent(mockContent)
          setSeoTips(mockSeoTips)
          setCredits(remainingCredits)
          
          toast({
            title: "콘텐츠가 생성되었습니다",
            description: "크레딧 1개가 차감되었습니다.",
          })
        } else {
          toast({
            title: "콘텐츠 생성 실패",
            description: "크레딧 차감 중 오류가 발생했습니다.",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error('콘텐츠 생성 중 오류:', error)
        toast({
          title: "콘텐츠 생성 실패",
          description: "오류가 발생했습니다.",
          variant: "destructive",
        })
      } finally {
        setIsGenerating(false)
      }
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">콘텐츠 메이스트로</span>
          </Link>

          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600 mr-2">
              {user?.email}
            </div>
            <Link href="/dashboard/credits">
              <Badge variant="outline" className="flex items-center space-x-1 cursor-pointer hover:bg-gray-100">
                <CreditCard className="w-4 h-4" />
                <span>
                  {isLoadingCredits ? "로딩 중..." : `크레딧: ${credits}개`}
                </span>
                <History className="w-3 h-3 ml-1" />
              </Badge>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-1" />
                크레딧 구매
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="w-4 h-4 mr-1" />
              로그아웃
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* 콘텐츠 생성기 */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  블로그 콘텐츠 생성기
                </CardTitle>
                <CardDescription>주제나 제목을 입력하면 AI가 완성도 높은 블로그 콘텐츠를 생성합니다</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="topic">주제 또는 제목</Label>
                  <Input
                    id="topic"
                    placeholder="예: 디지털 마케팅 전략, 건강한 식단 관리법 등"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  />
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating || credits <= 0 || isLoadingCredits}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                      콘텐츠 생성 중...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      콘텐츠 생성하기 (크레딧 1개 사용)
                    </>
                  )}
                </Button>

                {credits <= 0 && !isLoadingCredits && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-700 text-sm">
                      크레딧이 부족합니다.
                      <Link href="/pricing" className="underline ml-1">
                        크레딧을 구매
                      </Link>
                      해주세요.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* SEO 팁 */}
            {seoTips.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="w-5 h-5 mr-2" />
                    SEO 최적화 팁
                  </CardTitle>
                  <CardDescription>생성된 콘텐츠를 위한 맞춤형 SEO 추천사항</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {seoTips.map((tip, index) => (
                      <li key={index} className="flex items-start">
                        <TrendingUp className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* 생성된 콘텐츠 */}
          <div>
            <Card className="h-fit">
              <CardHeader>
                <CardTitle>생성된 콘텐츠</CardTitle>
                <CardDescription>AI가 생성한 블로그 콘텐츠를 확인하고 편집하세요</CardDescription>
              </CardHeader>
              <CardContent>
                {generatedContent ? (
                  <div className="space-y-4">
                    <Textarea
                      value={generatedContent}
                      onChange={(e) => setGeneratedContent(e.target.value)}
                      className="min-h-[500px] font-mono text-sm"
                      placeholder="생성된 콘텐츠가 여기에 표시됩니다..."
                    />
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(generatedContent)
                          toast({ title: "콘텐츠가 클립보드에 복사되었습니다" })
                        }}
                      >
                        복사하기
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          const blob = new Blob([generatedContent], { type: 'text/markdown' })
                          const url = URL.createObjectURL(blob)
                          const a = document.createElement('a')
                          a.href = url
                          a.download = `${topic.replace(/\s+/g, '-')}.md`
                          document.body.appendChild(a)
                          a.click()
                          document.body.removeChild(a)
                          URL.revokeObjectURL(url)
                          toast({ title: "콘텐츠가 다운로드되었습니다" })
                        }}
                      >
                        다운로드
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>주제를 입력하고 '콘텐츠 생성하기' 버튼을 클릭하세요</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
