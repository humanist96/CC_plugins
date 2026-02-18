import type { Tutorial } from "@/types/tutorial"

export const tutorial03: Tutorial = {
  slug: "03-sales-basics",
  title: "영업 플러그인 활용",
  description: "Sales 플러그인으로 고객 리서치, 콜 준비, 아웃리치 작성, 파이프라인 관리까지 영업 업무를 자동화합니다.",
  difficulty: "beginner",
  estimatedMinutes: 20,
  plugins: ["sales"],
  icon: "Briefcase",
  steps: [
    {
      id: 0,
      title: "기업 리서치",
      content: "삼성SDS와의 미팅을 앞두고 기업 정보를 조사합니다.\n`/sales:account-research` 명령어로 기업의 사업 동향, 주요 서비스, 경영진 정보를 조사할 수 있습니다.",
      type: "exercise",
      command: {
        text: "/sales:account-research",
        plugin: "sales",
        sandboxResponseId: "sales-account-research-sds",
      },
      hints: [
        "명령어 입력 후 프롬프트가 나타나면 조사할 기업명을 입력하세요",
        "\"삼성SDS에 대해 리서치해줘. 최근 사업 동향, 주요 서비스, 경영진 정보 포함해서\"",
      ],
      expectedResult: "삼성SDS 기업 리포트 (개요, 사업 영역, 경영진, 최근 동향)",
      xpReward: 20,
    },
    {
      id: 1,
      title: "콜 준비 자료 생성",
      content: "내일 삼성SDS 클라우드팀과의 미팅을 준비합니다.\n콜 준비 자료에는 회사 배경, 참석자 정보, 추천 아젠다, 핵심 질문 리스트가 포함됩니다.",
      type: "exercise",
      command: {
        text: "/sales:call-prep",
        plugin: "sales",
        sandboxResponseId: "sales-call-prep-sds",
      },
      hints: [
        "미팅 일시, 참석자, 주제, 우리 회사 정보를 함께 제공하세요",
        "구체적인 정보를 제공할수록 더 좋은 준비 자료를 받을 수 있습니다",
      ],
      xpReward: 25,
    },
    {
      id: 2,
      title: "아웃리치 이메일 작성",
      content: "신한은행 디지털혁신팀에 첫 콜드 이메일을 작성합니다.\n`/sales:draft-outreach` 명령어로 맞춤형 이메일 초안을 생성할 수 있습니다.",
      type: "exercise",
      command: {
        text: "/sales:draft-outreach",
        plugin: "sales",
        sandboxResponseId: "sales-draft-outreach",
      },
      hints: [
        "우리 제품, 타겟 담당자, 핵심 가치를 입력하세요",
      ],
      expectedResult: "맞춤형 콜드 이메일 초안",
      xpReward: 20,
    },
    {
      id: 3,
      title: "일일 브리핑",
      content: "오늘의 영업 일정과 주요 관심사를 정리한 모닝 브리핑을 생성합니다.",
      type: "exercise",
      command: {
        text: "/sales:daily-briefing",
        plugin: "sales",
        sandboxResponseId: "sales-daily-briefing",
      },
      hints: ["오늘 일정과 주요 관심사를 입력하세요"],
      xpReward: 15,
    },
    {
      id: 4,
      title: "파이프라인 리뷰",
      content: "현재 파이프라인을 분석하고 주간 액션 플랜을 생성합니다.\n각 딜의 단계, 금액, 승률을 입력하면 종합 분석을 받을 수 있습니다.",
      type: "exercise",
      command: {
        text: "/sales:pipeline-review",
        plugin: "sales",
        sandboxResponseId: "sales-pipeline-review",
      },
      hints: [
        "각 딜의 고객명, 프로젝트명, 금액, 단계, 승률을 포함하세요",
      ],
      expectedResult: "파이프라인 퍼널 분석 + 주간 액션 플랜",
      xpReward: 25,
    },
    {
      id: 5,
      title: "매출 예측",
      content: "파이프라인 데이터를 기반으로 분기별 매출을 예측합니다.\nBest / Likely / Worst 시나리오와 Commit vs Upside를 구분합니다.",
      type: "exercise",
      command: {
        text: "/sales:forecast",
        plugin: "sales",
        sandboxResponseId: "sales-forecast",
      },
      xpReward: 20,
    },
    {
      id: 6,
      title: "통화 요약",
      content: "삼성SDS 미팅 노트를 정리하여 핵심 요약, 액션 아이템, 팔로업 이메일을 생성합니다.",
      type: "exercise",
      command: {
        text: "/sales:call-summary",
        plugin: "sales",
        sandboxResponseId: "sales-call-summary",
      },
      hints: ["미팅 참석자, 논의 내용, 주요 결정 사항을 입력하세요"],
      expectedResult: "핵심 요약 + 액션 아이템 + 팔로업 이메일 초안",
      xpReward: 20,
    },
    {
      id: 7,
      title: "핵심 팁",
      content: "Sales 플러그인 활용 팁:\n\n1. **구체적으로 입력**: 회사명, 담당자, 제품, 금액 등 구체적 정보를 제공할수록 결과가 좋습니다\n2. **맥락 제공**: \"우리 회사는 코스콤이고 금융 IT 인프라를 전문으로 합니다\" 같은 배경 정보를 추가하세요\n3. **단계적 활용**: 리서치 → 콜 준비 → 미팅 → 콜 요약 → 팔로업 순으로 활용하면 효과적입니다",
      type: "guide",
      xpReward: 10,
    },
  ],
}
