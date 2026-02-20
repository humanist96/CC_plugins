"use client"

import { useState } from "react"
import { GraduationCap, User, Briefcase, BarChart3, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useUserProfileStore, type InvestmentLevel, type UserRole } from "@/stores/useUserProfileStore"

const ROLES: readonly { value: UserRole; label: string; icon: typeof User; description: string }[] = [
  { value: "investor", label: "개인 투자자", icon: User, description: "주식 투자에 관심 있는 개인" },
  { value: "broker", label: "영업 직원", icon: Briefcase, description: "금융 영업 담당 직원" },
  { value: "analyst", label: "애널리스트", icon: BarChart3, description: "기업/시장 분석 전문가" },
]

const LEVELS: readonly { value: InvestmentLevel; label: string; description: string; emoji: string }[] = [
  { value: "beginner", label: "초보", description: "금융 기본 개념부터 배우고 싶어요", emoji: "🌱" },
  { value: "intermediate", label: "중급", description: "PER, PBR 등 기본 지표는 알아요", emoji: "📊" },
  { value: "advanced", label: "고급", description: "기술적 분석, 밸류에이션 모델 활용", emoji: "🎯" },
]

export function LevelSelector() {
  const onboardingComplete = useUserProfileStore((s) => s.onboardingComplete)
  const setProfile = useUserProfileStore((s) => s.setProfile)
  const completeOnboarding = useUserProfileStore((s) => s.completeOnboarding)

  const [step, setStep] = useState(0)
  const [name, setName] = useState("")
  const [role, setRole] = useState<UserRole>("investor")
  const [level, setLevel] = useState<InvestmentLevel>("beginner")

  if (onboardingComplete) return null

  const handleComplete = async () => {
    const userName = name.trim() || "사용자"
    setProfile({ name: userName, role, investmentLevel: level })

    // Create auth session
    try {
      await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: userName, role }),
      })
    } catch {
      // Non-blocking — session creation failure shouldn't block onboarding
    }

    completeOnboarding()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <Card className="w-full max-w-lg mx-4">
        <CardContent className="pt-6 pb-6">
          {/* Step 0: Name */}
          {step === 0 && (
            <div className="space-y-6">
              <div className="text-center">
                <GraduationCap className="h-10 w-10 text-primary mx-auto mb-3" />
                <h2 className="text-xl font-bold mb-1">Claude Finance Lab</h2>
                <p className="text-sm text-muted-foreground">맞춤형 투자 어시스턴트를 설정합니다</p>
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">이름 (선택)</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="이름을 입력하세요"
                  className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  onKeyDown={(e) => e.key === "Enter" && setStep(1)}
                />
              </div>

              <Button onClick={() => setStep(1)} className="w-full gap-2">
                다음
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Step 1: Role */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-center mb-2">
                <h2 className="text-lg font-bold">역할을 선택하세요</h2>
                <p className="text-xs text-muted-foreground">브로커 역할은 VRM 대시보드에 접근할 수 있습니다</p>
              </div>

              <div className="space-y-2">
                {ROLES.map((r) => {
                  const Icon = r.icon
                  return (
                    <button
                      key={r.value}
                      onClick={() => setRole(r.value)}
                      className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-colors text-left ${
                        role === r.value
                          ? "border-primary bg-primary/10"
                          : "border-border hover:bg-muted/50"
                      }`}
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      <div>
                        <div className="font-medium text-sm">{r.label}</div>
                        <div className="text-xs text-muted-foreground">{r.description}</div>
                      </div>
                    </button>
                  )
                })}
              </div>

              <Button onClick={() => setStep(2)} className="w-full gap-2">
                다음
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Step 2: Level */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="text-center mb-2">
                <h2 className="text-lg font-bold">투자 경험 수준</h2>
                <p className="text-xs text-muted-foreground">Claude가 수준에 맞춰 응답합니다</p>
              </div>

              <div className="space-y-2">
                {LEVELS.map((l) => (
                  <button
                    key={l.value}
                    onClick={() => setLevel(l.value)}
                    className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-colors text-left ${
                      level === l.value
                        ? "border-primary bg-primary/10"
                        : "border-border hover:bg-muted/50"
                    }`}
                  >
                    <span className="text-2xl">{l.emoji}</span>
                    <div>
                      <div className="font-medium text-sm">{l.label}</div>
                      <div className="text-xs text-muted-foreground">{l.description}</div>
                    </div>
                  </button>
                ))}
              </div>

              <Button onClick={handleComplete} className="w-full">
                시작하기
              </Button>
            </div>
          )}

          {/* Progress dots */}
          <div className="flex justify-center gap-1.5 mt-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === step ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
