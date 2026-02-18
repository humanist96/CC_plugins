import type { Quiz } from "@/types/simulation"

export const quizzes: readonly Quiz[] = [
  {
    id: "quiz-02",
    tutorialSlug: "02-stock-lookup",
    title: "주식 정보 조회 퀴즈",
    passingScore: 60,
    questions: [
      {
        id: 1,
        type: "multiple_choice",
        question: "Apple의 미국 주식 티커 심볼은?",
        options: ["APPL", "AAPL", "APL", "APPLE"],
        correctAnswer: "AAPL",
        explanation: "Apple Inc.의 나스닥 티커 심볼은 AAPL입니다.",
        points: 20,
      },
      {
        id: 2,
        type: "multiple_choice",
        question: "PER(주가수익비율)이 높다는 것은 어떤 의미인가?",
        options: [
          "주가가 이익 대비 저렴하다",
          "주가가 이익 대비 비싸다",
          "배당수익률이 높다",
          "거래량이 많다",
        ],
        correctAnswer: "주가가 이익 대비 비싸다",
        explanation: "PER = 주가 / 주당순이익(EPS). PER이 높으면 이익 대비 주가가 높다(비싸다)는 의미입니다.",
        points: 20,
      },
      {
        id: 3,
        type: "multiple_choice",
        question: "Alpha Vantage 무료 티어의 일일 API 호출 제한은?",
        options: ["100콜", "250콜", "500콜", "1000콜"],
        correctAnswer: "500콜",
        explanation: "Alpha Vantage 무료 티어는 하루 500콜, 분당 5콜 제한이 있습니다.",
        points: 20,
      },
      {
        id: 4,
        type: "command_input",
        question: "NVDA(NVIDIA)의 최근 뉴스와 감성 분석을 요청하는 자연어 명령을 작성하세요.",
        correctAnswer: "NVDA 관련 최신 뉴스와 시장 감성을 분석해줘",
        explanation: "자연어로 종목명 + 분석 요청을 하면 Claude가 Alpha Vantage 뉴스 API를 활용합니다.",
        points: 20,
      },
      {
        id: 5,
        type: "multiple_choice",
        question: "한국 주식(삼성전자)을 Alpha Vantage로 직접 조회할 수 있는가?",
        options: [
          "KRX 거래소를 직접 조회 가능",
          "직접 조회 불가, SMSN.LON 등 대체 경로 활용",
          "005930.KS로 직접 조회 가능",
          "한국 주식은 지원하지 않음",
        ],
        correctAnswer: "직접 조회 불가, SMSN.LON 등 대체 경로 활용",
        explanation: "Alpha Vantage는 KRX 직접 조회를 지원하지 않아, 런던 거래소(SMSN.LON) 데이터와 웹 검색을 조합합니다.",
        points: 20,
      },
    ],
  },
  {
    id: "quiz-03",
    tutorialSlug: "03-sales-basics",
    title: "영업 플러그인 퀴즈",
    passingScore: 60,
    questions: [
      {
        id: 1,
        type: "multiple_choice",
        question: "고객 기업 리서치에 사용하는 명령어는?",
        options: [
          "/sales:forecast",
          "/sales:account-research",
          "/sales:call-prep",
          "/sales:pipeline-review",
        ],
        correctAnswer: "/sales:account-research",
        explanation: "/sales:account-research는 기업 또는 인물에 대한 영업 인텔리전스 리서치를 수행합니다.",
        points: 20,
      },
      {
        id: 2,
        type: "multiple_choice",
        question: "미팅 후 액션 아이템과 팔로업 이메일을 자동 생성하는 명령어는?",
        options: [
          "/sales:call-prep",
          "/sales:draft-outreach",
          "/sales:call-summary",
          "/sales:daily-briefing",
        ],
        correctAnswer: "/sales:call-summary",
        explanation: "/sales:call-summary는 미팅 노트를 정리하여 핵심 요약, 액션 아이템, 팔로업 이메일을 생성합니다.",
        points: 20,
      },
      {
        id: 3,
        type: "multiple_choice",
        question: "Sales 플러그인 활용 시 가장 효과적인 순서는?",
        options: [
          "아웃리치 → 콜 준비 → 리서치",
          "리서치 → 콜 준비 → 미팅 → 콜 요약 → 팔로업",
          "파이프라인 → 예측 → 리서치",
          "콜 요약 → 리서치 → 아웃리치",
        ],
        correctAnswer: "리서치 → 콜 준비 → 미팅 → 콜 요약 → 팔로업",
        explanation: "리서치로 시작해서 콜 준비 → 미팅 → 콜 요약 → 팔로업 순으로 활용하면 일관된 워크플로우를 유지할 수 있습니다.",
        points: 20,
      },
      {
        id: 4,
        type: "command_input",
        question: "파이프라인을 분석하고 액션 플랜을 얻기 위한 슬래시 명령어를 입력하세요.",
        correctAnswer: "/sales:pipeline-review",
        explanation: "/sales:pipeline-review 명령어로 현재 파이프라인을 분석하고 우선순위별 액션 플랜을 생성합니다.",
        points: 20,
      },
      {
        id: 5,
        type: "multiple_choice",
        question: "Sales 플러그인 사용 시 결과 품질을 높이는 방법은?",
        options: [
          "짧고 간단하게 입력",
          "회사명, 담당자, 제품, 금액 등 구체적 정보를 제공",
          "영어로 입력",
          "명령어만 입력하고 추가 정보 없이 사용",
        ],
        correctAnswer: "회사명, 담당자, 제품, 금액 등 구체적 정보를 제공",
        explanation: "구체적인 정보(회사명, 담당자, 제품, 금액)를 제공할수록 더 맞춤화된 결과를 받을 수 있습니다.",
        points: 20,
      },
    ],
  },
  {
    id: "quiz-04",
    tutorialSlug: "04-financial-analysis",
    title: "재무 분석 퀴즈",
    passingScore: 60,
    questions: [
      {
        id: 1,
        type: "multiple_choice",
        question: "재무제표를 생성하는 Finance 플러그인 명령어는?",
        options: [
          "/finance:journal-entry-prep",
          "/finance:financial-statements",
          "/finance:variance-analysis",
          "/finance:reconciliation",
        ],
        correctAnswer: "/finance:financial-statements",
        explanation: "/finance:financial-statements로 손익계산서, 대차대조표, 현금흐름표를 생성할 수 있습니다.",
        points: 25,
      },
      {
        id: 2,
        type: "multiple_choice",
        question: "예산 대비 실적 분석에 주로 사용되는 차트는?",
        options: ["파이차트", "워터폴 차트", "캔들스틱 차트", "히트맵"],
        correctAnswer: "워터폴 차트",
        explanation: "워터폴 차트는 예산에서 실적까지 각 항목별 증감을 시각적으로 보여주는 데 적합합니다.",
        points: 25,
      },
      {
        id: 3,
        type: "command_input",
        question: "계정 대조(은행 잔액 대조)를 수행하는 명령어를 입력하세요.",
        correctAnswer: "/finance:reconciliation",
        explanation: "/finance:reconciliation 명령어로 은행 잔액, 매출채권 등의 계정 대조를 수행할 수 있습니다.",
        points: 25,
      },
      {
        id: 4,
        type: "multiple_choice",
        question: "Finance 플러그인 사용 시 분석 품질을 높이는 팁이 아닌 것은?",
        options: [
          "표 형태로 데이터 제공",
          "회계 기준(GAAP, K-IFRS) 명시",
          "비교 기간을 함께 제공",
          "데이터 없이 일반적 분석 요청",
        ],
        correctAnswer: "데이터 없이 일반적 분석 요청",
        explanation: "구체적인 데이터, 회계 기준, 비교 기간을 제공해야 정확하고 의미 있는 분석 결과를 얻을 수 있습니다.",
        points: 25,
      },
    ],
  },
]

export function getQuizByTutorialSlug(slug: string): Quiz | undefined {
  return quizzes.find((q) => q.tutorialSlug === slug)
}

export function getQuizById(id: string): Quiz | undefined {
  return quizzes.find((q) => q.id === id)
}
