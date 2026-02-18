import type { Badge } from "@/types/progress"

export const badges: readonly Badge[] = [
  {
    id: "first-step",
    name: "첫 걸음",
    description: "튜토리얼 01 완료",
    icon: "Star",
    condition: "tutorial_01_complete",
    xpReward: 50,
  },
  {
    id: "stock-beginner",
    name: "주식 초보",
    description: "첫 주가 조회 성공",
    icon: "TrendingUp",
    condition: "first_stock_lookup",
    xpReward: 30,
  },
  {
    id: "sales-pro",
    name: "영업 프로",
    description: "튜토리얼 03 전체 완료",
    icon: "Briefcase",
    condition: "tutorial_03_complete",
    xpReward: 100,
  },
  {
    id: "indicator-analyst",
    name: "지표 분석가",
    description: "기술적 지표 5개 이상 조회",
    icon: "Activity",
    condition: "indicators_5_plus",
    xpReward: 80,
  },
  {
    id: "finance-expert",
    name: "재무 전문가",
    description: "튜토리얼 04 전체 완료",
    icon: "DollarSign",
    condition: "tutorial_04_complete",
    xpReward: 100,
  },
  {
    id: "data-scientist",
    name: "데이터 사이언티스트",
    description: "대시보드 1개 생성",
    icon: "BarChart3",
    condition: "first_dashboard",
    xpReward: 120,
  },
  {
    id: "customer-hero",
    name: "고객 히어로",
    description: "튜토리얼 07 전체 완료",
    icon: "Headphones",
    condition: "tutorial_07_complete",
    xpReward: 100,
  },
  {
    id: "master",
    name: "마스터",
    description: "전체 튜토리얼 완료",
    icon: "Rocket",
    condition: "all_tutorials_complete",
    xpReward: 500,
  },
  {
    id: "streak-learner",
    name: "연속 학습자",
    description: "5일 연속 접속",
    icon: "Flame",
    condition: "streak_5_days",
    xpReward: 50,
  },
  {
    id: "leader",
    name: "리더",
    description: "팀 내 1등 달성",
    icon: "Crown",
    condition: "team_first",
    xpReward: 200,
  },
]

export function getBadgeById(id: string): Badge | undefined {
  return badges.find((b) => b.id === id)
}
