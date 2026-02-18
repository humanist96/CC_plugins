export interface CommandRef {
  readonly command: string
  readonly plugin: string
  readonly category: string
  readonly description: string
  readonly examples: readonly string[]
  readonly relatedCommands: readonly string[]
  readonly tutorialSlug?: string
}

export const commands: readonly CommandRef[] = [
  // Sales
  { command: "/sales:account-research", plugin: "Sales", category: "영업", description: "기업 또는 인물에 대한 영업 인텔리전스 리서치를 수행합니다.", examples: ["삼성SDS에 대해 리서치해줘", "카카오뱅크 CTO에 대해 조사해줘"], relatedCommands: ["/sales:call-prep", "/sales:draft-outreach"], tutorialSlug: "03-sales-basics" },
  { command: "/sales:call-prep", plugin: "Sales", category: "영업", description: "미팅/콜을 위한 준비 자료를 생성합니다. 참석자 정보, 추천 아젠다, 핵심 질문을 포함합니다.", examples: ["삼성SDS 클라우드팀 미팅 준비해줘", "KB국민은행 방문 준비 자료 만들어줘"], relatedCommands: ["/sales:account-research", "/sales:call-summary"], tutorialSlug: "03-sales-basics" },
  { command: "/sales:daily-briefing", plugin: "Sales", category: "영업", description: "오늘의 영업 일정과 시장 동향을 포함한 모닝 브리핑을 생성합니다.", examples: ["오늘 일정 정리해줘", "모닝 브리핑 생성해줘"], relatedCommands: ["/sales:pipeline-review"], tutorialSlug: "03-sales-basics" },
  { command: "/sales:draft-outreach", plugin: "Sales", category: "영업", description: "타겟 고객에게 보낼 맞춤형 이메일 초안을 작성합니다.", examples: ["신한은행에 콜드 이메일 작성해줘", "팔로업 이메일 써줘"], relatedCommands: ["/sales:account-research"], tutorialSlug: "03-sales-basics" },
  { command: "/sales:pipeline-review", plugin: "Sales", category: "영업", description: "파이프라인을 분석하고 우선순위별 액션 플랜을 생성합니다.", examples: ["현재 파이프라인 분석해줘", "이번 분기 딜 리뷰해줘"], relatedCommands: ["/sales:forecast"], tutorialSlug: "03-sales-basics" },
  { command: "/sales:forecast", plugin: "Sales", category: "영업", description: "파이프라인 기반 매출 예측을 Best/Likely/Worst 시나리오로 생성합니다.", examples: ["다음 분기 매출 예측해줘", "파이프라인 기반 매출 전망 분석"], relatedCommands: ["/sales:pipeline-review"], tutorialSlug: "03-sales-basics" },
  { command: "/sales:call-summary", plugin: "Sales", category: "영업", description: "미팅/콜 노트를 정리하여 핵심 요약과 액션 아이템을 도출합니다.", examples: ["미팅 노트 정리해줘", "통화 내용 요약해줘"], relatedCommands: ["/sales:call-prep", "/sales:draft-outreach"], tutorialSlug: "03-sales-basics" },
  { command: "/sales:competitive-intelligence", plugin: "Sales", category: "영업", description: "경쟁사를 분석하고 배틀카드를 생성합니다.", examples: ["Bloomberg 대비 우리 강점 분석해줘", "경쟁사 비교 자료 만들어줘"], relatedCommands: ["/sales:account-research"], tutorialSlug: "08-advanced-workflows" },
  { command: "/sales:create-an-asset", plugin: "Sales", category: "영업", description: "영업 제안서, 원페이저, 데모 자료 등 맞춤형 영업 자산을 생성합니다.", examples: ["카카오뱅크 대상 원페이저 만들어줘", "제품 소개서 작성해줘"], relatedCommands: ["/sales:account-research"], tutorialSlug: "08-advanced-workflows" },

  // Finance
  { command: "/finance:financial-statements", plugin: "Finance", category: "재무", description: "손익계산서, 대차대조표, 현금흐름표를 생성합니다. 전기 대비 분석 포함.", examples: ["4분기 손익계산서 생성해줘", "대차대조표 분석해줘"], relatedCommands: ["/finance:variance-analysis"], tutorialSlug: "04-financial-analysis" },
  { command: "/finance:journal-entry-prep", plugin: "Finance", category: "재무", description: "분개장 작성 (차변/대변). 매출인식, 급여, 감가상각 등.", examples: ["12월 급여 분개 작성해줘", "결산 조정 분개 만들어줘"], relatedCommands: ["/finance:close-management"], tutorialSlug: "04-financial-analysis" },
  { command: "/finance:reconciliation", plugin: "Finance", category: "재무", description: "은행 잔액, 매출채권 등 계정 대조표를 작성하고 차이 분석합니다.", examples: ["은행 잔액 대조해줘", "매출채권 보조원장 대조해줘"], relatedCommands: ["/finance:close-management"], tutorialSlug: "04-financial-analysis" },
  { command: "/finance:variance-analysis", plugin: "Finance", category: "재무", description: "예산 대비 실적, 전년 동기 대비 분석을 수행합니다.", examples: ["부서별 예산 분석해줘", "전년 대비 매출 분석해줘"], relatedCommands: ["/finance:financial-statements"], tutorialSlug: "04-financial-analysis" },
  { command: "/finance:close-management", plugin: "Finance", category: "재무", description: "월말/분기 결산 일정, 체크리스트, 담당자를 관리합니다.", examples: ["12월 결산 일정 관리해줘", "결산 체크리스트 만들어줘"], relatedCommands: ["/finance:journal-entry-prep", "/finance:reconciliation"], tutorialSlug: "04-financial-analysis" },
  { command: "/finance:audit-support", plugin: "Finance", category: "재무", description: "SOX 감사 지원, 테스트 워크페이퍼, 샘플 선정을 수행합니다.", examples: ["SOX 테스트 샘플 선정해줘", "감사 워크페이퍼 작성해줘"], relatedCommands: ["/finance:close-management"], tutorialSlug: "04-financial-analysis" },

  // Data
  { command: "/data:analyze", plugin: "Data", category: "데이터", description: "데이터 분석 질문에 답변합니다. 통계, 트렌드, 상관관계 등.", examples: ["영업 성과 데이터 분석해줘", "매출 트렌드 분석해줘"], relatedCommands: ["/data:create-viz"], tutorialSlug: "05-data-analysis" },
  { command: "/data:write-query", plugin: "Data", category: "데이터", description: "SQL 쿼리를 작성합니다. PostgreSQL, Snowflake, BigQuery 등 지원.", examples: ["월별 매출 쿼리 작성해줘", "고객 LTV 계산 SQL 만들어줘"], relatedCommands: ["/data:analyze"], tutorialSlug: "05-data-analysis" },
  { command: "/data:explore-data", plugin: "Data", category: "데이터", description: "데이터 프로파일링 - 결측값, 이상치, 분포, 패턴을 분석합니다.", examples: ["CSV 데이터 품질 분석해줘", "데이터 분포 확인해줘"], relatedCommands: ["/data:analyze"], tutorialSlug: "05-data-analysis" },
  { command: "/data:build-dashboard", plugin: "Data", category: "데이터", description: "인터랙티브 HTML 대시보드를 생성합니다.", examples: ["영업 대시보드 만들어줘", "경영진 보고 대시보드 생성해줘"], relatedCommands: ["/data:create-viz"], tutorialSlug: "05-data-analysis" },
  { command: "/data:create-viz", plugin: "Data", category: "데이터", description: "Python 기반 시각화 (차트, 그래프)를 생성합니다.", examples: ["매출 막대차트 만들어줘", "주가 캔들스틱 차트 생성해줘"], relatedCommands: ["/data:build-dashboard"], tutorialSlug: "05-data-analysis" },
  { command: "/data:validate", plugin: "Data", category: "데이터", description: "분석 결과를 QA합니다. 정확성, 논리성, 바이어스 검증.", examples: ["분석 결과 검증해줘", "이 수치 맞는지 확인해줘"], relatedCommands: ["/data:analyze"], tutorialSlug: "05-data-analysis" },

  // Customer Support
  { command: "/customer-support:triage", plugin: "Support", category: "고객지원", description: "고객 문의를 분류하고 우선순위(P1~P4)를 지정합니다.", examples: ["이 티켓 분류해줘", "우선순위 매겨줘"], relatedCommands: ["/customer-support:draft-response"], tutorialSlug: "07-customer-management" },
  { command: "/customer-support:draft-response", plugin: "Support", category: "고객지원", description: "고객에게 보낼 응답 초안을 작성합니다.", examples: ["장애 안내 메일 작성해줘", "기능 요청 응답 써줘"], relatedCommands: ["/customer-support:triage"], tutorialSlug: "07-customer-management" },
  { command: "/customer-support:research", plugin: "Support", category: "고객지원", description: "고객 문의에 대한 기술/계약 조사를 수행합니다.", examples: ["API 타임아웃 원인 조사해줘", "계약 갱신 조건 분석해줘"], relatedCommands: ["/customer-support:draft-response"], tutorialSlug: "07-customer-management" },
  { command: "/customer-support:escalate", plugin: "Support", category: "고객지원", description: "이슈를 엔지니어링/제품/경영진에게 에스컬레이션합니다.", examples: ["이 이슈 엔지니어링팀에 전달해줘", "에스컬레이션 리포트 작성해줘"], relatedCommands: ["/customer-support:triage"], tutorialSlug: "07-customer-management" },
  { command: "/customer-support:kb-article", plugin: "Support", category: "고객지원", description: "해결된 이슈를 기반으로 지식 베이스 문서를 작성합니다.", examples: ["API 인증 FAQ 문서 작성해줘", "트러블슈팅 가이드 만들어줘"], relatedCommands: ["/customer-support:research"], tutorialSlug: "07-customer-management" },

  // Enterprise Search
  { command: "/enterprise-search:search", plugin: "Search", category: "검색", description: "연결된 모든 소스에서 통합 검색합니다.", examples: ["KB국민은행 장애 관련 문서 찾아줘", "API 인증 관련 내부 문서 검색해줘"], relatedCommands: ["/enterprise-search:digest"], tutorialSlug: "07-customer-management" },
  { command: "/enterprise-search:digest", plugin: "Search", category: "검색", description: "주간/일간 다이제스트를 생성합니다.", examples: ["이번 주 고객 지원 다이제스트 만들어줘", "주간 활동 요약 생성해줘"], relatedCommands: ["/enterprise-search:search"], tutorialSlug: "07-customer-management" },

  // Productivity
  { command: "/start", plugin: "Productivity", category: "생산성", description: "Productivity 대시보드를 초기화하고 시작합니다.", examples: ["/start"], relatedCommands: ["/update"], tutorialSlug: "01-getting-started" },
  { command: "/update", plugin: "Productivity", category: "생산성", description: "작업 상태를 동기화하고 메모리를 업데이트합니다.", examples: ["/update"], relatedCommands: ["/start"], tutorialSlug: "01-getting-started" },
]

export const pluginCategories = ["전체", "영업", "재무", "데이터", "고객지원", "검색", "생산성"] as const
