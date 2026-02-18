import type { SimulationResponse } from "@/types/simulation"

const sandboxResponses: Record<string, SimulationResponse> = {
  "stock-aapl": {
    id: "stock-aapl",
    command: "AAPL 현재 주가 알려줘",
    triggerKeywords: ["AAPL", "Apple", "애플", "주가"],
    contents: [
      {
        type: "stock_quote",
        title: "Apple Inc. (AAPL)",
        data: {
          symbol: "AAPL",
          name: "Apple Inc.",
          price: 237.49,
          change: 3.21,
          changePercent: 1.37,
          open: 234.28,
          high: 238.15,
          low: 233.90,
          volume: "52.3M",
          marketCap: "3.62T",
          pe: 38.5,
          week52High: 260.10,
          week52Low: 164.08,
        },
      },
    ],
  },
  "stock-samsung": {
    id: "stock-samsung",
    command: "삼성전자 주가 알려줘",
    triggerKeywords: ["삼성전자", "Samsung", "SMSN"],
    contents: [
      {
        type: "stock_quote",
        title: "삼성전자 (005930.KS)",
        data: {
          symbol: "005930.KS",
          name: "삼성전자",
          price: 58400,
          change: -200,
          changePercent: -0.34,
          open: 58600,
          high: 59100,
          low: 58200,
          volume: "12.8M",
          marketCap: "348.5조원",
          pe: 12.3,
          week52High: 88800,
          week52Low: 49900,
          currency: "KRW",
        },
      },
    ],
  },
  "stock-msft": {
    id: "stock-msft",
    command: "Microsoft 현재 주가를 조회해줘",
    triggerKeywords: ["MSFT", "Microsoft", "마이크로소프트"],
    contents: [
      {
        type: "stock_quote",
        title: "Microsoft Corporation (MSFT)",
        data: {
          symbol: "MSFT",
          name: "Microsoft Corporation",
          price: 415.28,
          change: 5.42,
          changePercent: 1.32,
          open: 410.50,
          high: 416.80,
          low: 409.20,
          volume: "21.5M",
          marketCap: "3.08T",
          pe: 36.2,
          week52High: 468.35,
          week52Low: 309.45,
        },
      },
    ],
  },
  "forex-usdkrw": {
    id: "forex-usdkrw",
    command: "USD/KRW 현재 환율 조회해줘",
    triggerKeywords: ["USD/KRW", "환율", "달러"],
    contents: [
      {
        type: "stock_quote",
        title: "USD/KRW 환율",
        data: {
          symbol: "USD/KRW",
          name: "미국 달러 / 대한민국 원",
          price: 1432.50,
          change: -3.20,
          changePercent: -0.22,
          open: 1435.70,
          high: 1438.30,
          low: 1430.10,
          volume: "-",
          currency: "KRW",
        },
      },
    ],
  },
  "sales-account-research-sds": {
    id: "sales-account-research-sds",
    command: "/sales:account-research",
    triggerKeywords: ["삼성SDS", "account-research"],
    contents: [
      {
        type: "report",
        title: "삼성SDS 기업 리서치 리포트",
        data: {
          sections: [
            {
              title: "기업 개요",
              content: "삼성SDS (018260.KS)\n설립: 1985년 | 매출: 13.3조원 (2024)\n주요 사업: IT 서비스, 클라우드, AI/분석, 보안, SI\n임직원: 약 15,000명",
            },
            {
              title: "주요 서비스",
              items: ["클라우드 (삼성 클라우드 플랫폼)", "AI/분석 (Brightics AI)", "보안 (Knox, 블록체인)", "물류 (Cello)"],
            },
            {
              title: "경영진",
              items: ["대표이사: 황성우", "CTO: 클라우드/AI 담당 부사장", "영업총괄: 금융솔루션사업부"],
            },
            {
              title: "최근 동향",
              items: ["생성형 AI 기반 기업용 솔루션 출시", "클라우드 매출 YoY 25% 성장", "금융권 디지털 전환 프로젝트 다수 수주"],
            },
            {
              title: "영업 공략 포인트",
              items: ["AI/클라우드 전환 니즈 높음", "금융보안 요구사항 강화 → 보안 솔루션 결합 제안", "파트너십보다 기술 차별화 강조 필요"],
            },
          ],
        },
      },
    ],
  },
  "sales-call-prep-sds": {
    id: "sales-call-prep-sds",
    command: "/sales:call-prep",
    triggerKeywords: ["call-prep", "콜 준비"],
    contents: [
      {
        type: "report",
        title: "미팅 준비 자료: 삼성SDS 클라우드팀",
        data: {
          sections: [
            {
              title: "미팅 정보",
              content: "일시: 내일 14:00 | 장소: 삼성SDS 잠실캠퍼스\n참석자: 김철수 팀장, 박영희 과장\n주제: 금융 클라우드 인프라 전환 프로젝트",
            },
            {
              title: "추천 아젠다",
              items: ["1. 인사 및 배경 소개 (5분)", "2. 삼성SDS 클라우드 전환 현황 청취 (15분)", "3. 코스콤 금융 클라우드 인프라 소개 (15분)", "4. 기술 Q&A 및 협업 방안 논의 (15분)", "5. Next Step 합의 (10분)"],
            },
            {
              title: "핵심 질문 리스트",
              items: ["현재 온프레미스 vs 클라우드 비율은?", "보안 인증 요구사항 (ISMS-P)?", "전환 타임라인과 예산 규모는?", "의사결정자와 프로세스는?"],
            },
          ],
        },
      },
    ],
  },
  "sales-draft-outreach": {
    id: "sales-draft-outreach",
    command: "/sales:draft-outreach",
    triggerKeywords: ["draft-outreach", "이메일"],
    contents: [
      {
        type: "email_draft",
        title: "콜드 이메일 초안",
        data: {
          subject: "[코스콤] AI 기반 금융 데이터 분석 플랫폼 소개",
          to: "신한은행 디지털혁신팀",
          body: "안녕하세요,\n\n코스콤 금융솔루션팀 [이름]입니다.\n\n신한은행의 디지털 혁신 전략에 깊은 관심을 가지고 연락드립니다. 최근 귀행에서 추진하시는 AI 기반 리스크 관리 고도화와 관련하여, 코스콤의 실시간 금융 데이터 분석 플랫폼이 도움이 될 수 있을 것 같아 소개드리고자 합니다.\n\n[주요 가치 제안]\n- 실시간 시장 데이터 분석 (지연 < 100ms)\n- AI 기반 리스크 관리 자동화\n- 금융보안원 인증, ISMS-P 획득 완료\n\n간단한 미팅을 통해 자세한 내용을 공유드릴 수 있을까요?\n\n감사합니다.",
        },
      },
    ],
  },
  "sales-daily-briefing": {
    id: "sales-daily-briefing",
    command: "/sales:daily-briefing",
    triggerKeywords: ["daily-briefing", "모닝 브리핑"],
    contents: [
      {
        type: "report",
        title: "오늘의 영업 브리핑",
        data: {
          sections: [
            {
              title: "오늘의 일정",
              items: ["10:00 삼성SDS 팔로업 콜 - 계약 진행 상황 확인", "14:00 KB국민은행 신규 미팅 - 첫 제품 소개", "16:00 팀 내부 파이프라인 리뷰"],
            },
            {
              title: "주요 관심사",
              items: ["삼성SDS: 내부 승인 진행 현황 확인 필요", "KB국민은행: 디지털 전환 예산 확보 여부 탐색"],
            },
            {
              title: "시장 동향",
              content: "코스피 2,450 (+0.8%), 원/달러 1,432 (-0.2%)\n금융 섹터 강세, 특히 은행주 상승",
            },
          ],
        },
      },
    ],
  },
  "sales-pipeline-review": {
    id: "sales-pipeline-review",
    command: "/sales:pipeline-review",
    triggerKeywords: ["pipeline-review", "파이프라인"],
    contents: [
      {
        type: "pipeline",
        title: "파이프라인 분석",
        data: {
          stages: [
            { name: "발굴", deals: 2, value: 55, items: ["KB국민은행 30억 (20%)", "신한은행 40억 (15%)"] },
            { name: "제안", deals: 1, value: 15, items: ["하나은행 15억 (40%)"] },
            { name: "협상", deals: 2, value: 75, items: ["삼성SDS 50억 (60%)", "NH투자증권 25억 (70%)"] },
          ],
          totalValue: 160,
          weightedValue: 58.5,
          actionItems: ["삼성SDS: 기술 검토 미팅 일정 확정", "NH투자증권: 최종 가격 제안서 전달", "KB국민은행: 첫 미팅 후 제안서 작성"],
        },
      },
    ],
    charts: [
      {
        type: "funnel",
        title: "파이프라인 퍼널",
        data: [
          { name: "발굴", value: 55, count: 2 },
          { name: "제안", value: 15, count: 1 },
          { name: "협상", value: 75, count: 2 },
        ],
      },
    ],
  },
  "sales-forecast": {
    id: "sales-forecast",
    command: "/sales:forecast",
    triggerKeywords: ["forecast", "매출 예측"],
    contents: [
      {
        type: "table",
        title: "분기 매출 예측",
        data: {
          headers: ["시나리오", "매출 예측", "확률"],
          rows: [
            ["Best Case", "85억", "20%"],
            ["Likely Case", "58.5억", "60%"],
            ["Worst Case", "37.5억", "20%"],
          ],
          summary: "가중 평균 매출 예측: 58.5억",
        },
      },
    ],
  },
  "sales-call-summary": {
    id: "sales-call-summary",
    command: "/sales:call-summary",
    triggerKeywords: ["call-summary", "통화 요약"],
    contents: [
      {
        type: "report",
        title: "삼성SDS 미팅 요약",
        data: {
          sections: [
            { title: "핵심 요약", content: "삼성SDS 클라우드 전환 프로젝트 2분기 착수 희망. 예산 50억 규모 내부 승인 진행 중. 경쟁사 A사도 제안 중." },
            { title: "액션 아이템", items: ["ISMS-P 인증서 사본 전달 (담당: 최대리, 이번 주)", "기술 검토 미팅 일정 조율 (다음 주)", "POC 환경 구성 계획서 작성 (2주 내)", "경쟁사 대비 차별화 포인트 정리 (이번 주)"] },
            { title: "리스크", items: ["경쟁사 A사 제안 진행 중", "내부 예산 승인 불확실성"] },
          ],
        },
      },
    ],
  },
  "finance-income-statement": {
    id: "finance-income-statement",
    command: "/finance:financial-statements",
    triggerKeywords: ["financial-statements", "손익계산서"],
    contents: [
      {
        type: "table",
        title: "2025년 4분기 손익계산서",
        data: {
          headers: ["항목", "4분기", "3분기", "변동"],
          rows: [
            ["매출액", "150억", "140억", "+7.1%"],
            ["매출원가", "(90억)", "(85억)", "+5.9%"],
            ["매출총이익", "60억", "55억", "+9.1%"],
            ["판관비", "(30억)", "(28억)", "+7.1%"],
            ["영업이익", "30억", "27억", "+11.1%"],
            ["영업외수익", "2억", "1.5억", "+33.3%"],
            ["이자비용", "(3억)", "(3억)", "0%"],
            ["세전이익", "29억", "25.5억", "+13.7%"],
            ["법인세 (22%)", "(6.38억)", "(5.61억)", "+13.7%"],
            ["당기순이익", "22.62억", "19.89억", "+13.7%"],
          ],
        },
      },
    ],
  },
  "finance-journal-entry": {
    id: "finance-journal-entry",
    command: "/finance:journal-entry-prep",
    triggerKeywords: ["journal-entry", "분개장"],
    contents: [
      {
        type: "table",
        title: "12월 결산 분개장",
        data: {
          headers: ["No.", "계정과목", "차변", "대변", "적요"],
          rows: [
            ["1", "현금", "5억", "", "매출 수금"],
            ["1", "선수수익", "", "4.58억", "이연수익 (11개월분)"],
            ["1", "매출", "", "0.42억", "12월분 수익인식"],
            ["2", "급여", "8억", "", "12월 급여"],
            ["2", "예수금(소득세)", "", "1.2억", "원천징수"],
            ["2", "예수금(4대보험)", "", "0.72억", "회사부담금"],
            ["2", "현금", "", "6.08억", "실지급액"],
            ["3", "감가상각비", "1,667만", "", "월 상각액"],
            ["3", "감가상각누계액", "", "1,667만", "서버 장비"],
          ],
        },
      },
    ],
  },
  "finance-reconciliation": {
    id: "finance-reconciliation",
    command: "/finance:reconciliation",
    triggerKeywords: ["reconciliation", "계정 대조"],
    contents: [
      {
        type: "table",
        title: "은행 잔액 대조표 (12/31)",
        data: {
          headers: ["항목", "금액", "구분"],
          rows: [
            ["장부 잔액", "15억 3,200만", "시작"],
            ["(+) 은행 이체 수수료", "50만", "장부 조정"],
            ["(-) 이자 수입", "120만", "장부 조정"],
            ["(+) 부도 수표", "800만", "장부 조정"],
            ["조정 후 장부 잔액", "15억 3,930만", ""],
            ["", "", ""],
            ["은행 잔액", "15억 8,500만", "시작"],
            ["(-) 미결제 수표", "3,800만", "은행 조정"],
            ["(-) 미반영 입금", "1,500만", "은행 조정"],
            ["(+) 은행 기록 오류", "730만", "은행 조정"],
            ["조정 후 은행 잔액", "15억 3,930만", ""],
          ],
          summary: "조정 후 잔액 일치: 15억 3,930만원",
        },
      },
    ],
  },
  "finance-variance": {
    id: "finance-variance",
    command: "/finance:variance-analysis",
    triggerKeywords: ["variance-analysis", "예산 분석"],
    contents: [
      {
        type: "table",
        title: "예산 대비 실적 분석 (2025 Q4)",
        data: {
          headers: ["항목", "예산", "실적", "차이", "비율"],
          rows: [
            ["매출액", "150억", "162억", "+12억", "+8.0% ✅"],
            ["매출원가", "90억", "95억", "+5억", "+5.6% ⚠️"],
            ["인건비", "25억", "27억", "+2억", "+8.0% ⚠️"],
            ["마케팅비", "5억", "8억", "+3억", "+60.0% 🔴"],
            ["연구개발비", "10억", "9억", "-1억", "-10.0% ✅"],
            ["일반관리비", "8억", "7.5억", "-0.5억", "-6.3% ✅"],
            ["영업이익", "12억", "15.5억", "+3.5억", "+29.2% ✅"],
          ],
        },
      },
    ],
    charts: [
      {
        type: "waterfall",
        title: "예산 대비 실적 워터폴",
        data: [
          { name: "예산 영업이익", value: 12 },
          { name: "매출 증가", value: 12, isPositive: true },
          { name: "매출원가 증가", value: -5, isPositive: false },
          { name: "인건비 증가", value: -2, isPositive: false },
          { name: "마케팅비 초과", value: -3, isPositive: false },
          { name: "R&D 절감", value: 1, isPositive: true },
          { name: "관리비 절감", value: 0.5, isPositive: true },
          { name: "실적 영업이익", value: 15.5 },
        ],
      },
    ],
  },
  "cs-triage": {
    id: "cs-triage",
    command: "/customer-support:triage",
    triggerKeywords: ["triage", "티켓 분류"],
    contents: [
      {
        type: "report",
        title: "티켓 분류 결과",
        data: {
          sections: [
            { title: "우선순위", content: "P1 (Critical) - 즉시 대응 필요" },
            { title: "카테고리", content: "서비스 장애 > 데이터 지연 > 실시간 시세" },
            { title: "담당팀", content: "인프라 운영팀 → 즉시 에스컬레이션" },
            { title: "예상 해결 시간", content: "SLA 기준 30분 이내 복구 필요" },
            { title: "초기 대응", items: ["고객에게 장애 인지 알림 발송 (5분 내)", "인프라팀 핫라인 연결", "대체 데이터 소스 안내", "경과 보고 30분 간격으로 제공"] },
          ],
        },
      },
    ],
  },
  "cs-draft-response": {
    id: "cs-draft-response",
    command: "/customer-support:draft-response",
    triggerKeywords: ["draft-response", "고객 응답"],
    contents: [
      {
        type: "email_draft",
        title: "고객 응답 초안",
        data: {
          subject: "[긴급] 실시간 시세 데이터 지연 현황 안내",
          to: "KB국민은행 김부장님",
          body: "김부장님, 안녕하세요.\n코스콤 기술지원팀입니다.\n\n금일 아침 발생한 실시간 시세 데이터 지연 건에 대해 깊이 사과드립니다.\n\n[현황]\n- 원인: 데이터 피드 서버 부하 증가로 인한 처리 지연\n- 현재 조치: 엔지니어링팀 긴급 투입, 서버 스케일링 진행 중\n- 예상 복구: 1시간 이내\n\n[임시 대안]\n- 백업 데이터 피드 URL: backup.koscom.co.kr\n- 지연 시간이 5분 미만으로 감소 중\n\n복구 완료 시 즉시 안내드리겠습니다.\n다시 한번 불편을 드려 죄송합니다.",
        },
      },
    ],
  },
}

export function getSimulationResponse(commandOrId: string): SimulationResponse | undefined {
  if (sandboxResponses[commandOrId]) {
    return sandboxResponses[commandOrId]
  }

  const normalizedInput = commandOrId.toLowerCase()
  return Object.values(sandboxResponses).find((r) =>
    r.triggerKeywords.some((kw) => normalizedInput.includes(kw.toLowerCase()))
  )
}

export function getAllSimulationResponses(): SimulationResponse[] {
  return Object.values(sandboxResponses)
}
