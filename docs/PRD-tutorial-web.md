# PRD: 금융영업부서 플러그인 실습 웹 서비스

> Product Requirements Document v1.0
> 작성일: 2026-02-18

---

## 1. 프로젝트 개요

### 1.1 배경
금융영업부서에 Claude Code 플러그인(Sales, Finance, Data, Customer Support 등)과 MCP 서버(Alpha Vantage, Financial Datasets)가 도입되었으나, 텍스트 기반 튜토리얼(MD 파일)만으로는 실습 접근성이 낮고 학습 동기 부여가 어렵다.

### 1.2 목표
- 영업부서 직원이 **브라우저에서 직접 실습**할 수 있는 인터랙티브 학습 플랫폼
- 초급부터 고급까지 **단계별 가이드 + 시뮬레이션** 제공
- **실시간 금융 데이터 시각화**로 플러그인 활용 결과를 눈으로 확인

### 1.3 프로젝트명
**Claude Finance Lab** (가칭)

### 1.4 핵심 가치
| 원칙 | 설명 |
|------|------|
| **즉시 실습** | 설치 없이 브라우저에서 바로 체험 |
| **시각적 풍부함** | 차트, 대시보드, 애니메이션으로 결과를 직관적으로 |
| **단계적 학습** | 초급→중급→고급 자연스러운 학습 흐름 |
| **실전 시나리오** | 코스콤 영업 실무 기반의 사례로 실습 |

---

## 2. 타겟 사용자

### 2.1 주요 페르소나

#### 페르소나 A: 김영업 (초급)
- 역할: 영업 2년차 주임
- 기술 수준: 엑셀 중심 업무, CLI 경험 없음
- 니즈: "Claude Code가 뭔지 모르겠는데, 일단 따라해보고 싶어요"
- 핵심 가치: 쉬운 UI, 복사-붙여넣기 실습, 결과 미리보기

#### 페르소나 B: 박분석 (중급)
- 역할: 영업기획 5년차 과장
- 기술 수준: SQL 기초, 데이터 분석 경험 있음
- 니즈: "파이프라인 분석이나 재무 분석을 자동화하고 싶어요"
- 핵심 가치: 실전 시나리오, 커스터마이징 가능한 실습

#### 페르소나 C: 이전략 (고급)
- 역할: 영업전략팀장 10년차
- 기술 수준: 데이터 기반 의사결정에 익숙
- 니즈: "여러 플러그인을 조합해서 리포트를 자동 생성하고 싶어요"
- 핵심 가치: 복합 워크플로우, 라이브 데이터, 맞춤형 대시보드

---

## 3. 정보 구조 (IA)

```
Claude Finance Lab
│
├── / (랜딩 페이지)
│   ├── 히어로 섹션
│   ├── 플러그인 소개 카드
│   ├── 학습 경로 시각화
│   └── 시작하기 CTA
│
├── /dashboard (학습 대시보드)
│   ├── 진행률 오버뷰
│   ├── 최근 학습 이어하기
│   ├── 추천 다음 단계
│   └── 팀 리더보드
│
├── /tutorials (튜토리얼 목록)
│   ├── /tutorials/01-getting-started
│   ├── /tutorials/02-stock-lookup
│   ├── /tutorials/03-sales-basics
│   ├── /tutorials/04-financial-analysis
│   ├── /tutorials/05-data-analysis
│   ├── /tutorials/06-technical-indicators
│   ├── /tutorials/07-customer-management
│   └── /tutorials/08-advanced-workflows
│
├── /playground (자유 실습)
│   ├── 명령어 시뮬레이터
│   ├── 라이브 주가 조회
│   └── 대시보드 빌더
│
├── /reference (레퍼런스)
│   ├── 플러그인 명령어 사전
│   ├── MCP 서버 가이드
│   └── FAQ
│
└── /quiz (퀴즈/평가)
    ├── 단원별 퀴즈
    └── 종합 시나리오 평가
```

---

## 4. 핵심 기능

### 4.1 인터랙티브 튜토리얼 뷰어

가장 중요한 핵심 기능. 각 튜토리얼을 시각적으로 풍부하게 제공.

#### 레이아웃

```
┌─────────────────────────────────────────────────────────┐
│  ← 목록  │  03. 영업 플러그인 활용          [진행률 45%] │
├──────────┬──────────────────────────────────────────────┤
│          │                                              │
│ 단계 목록 │  가이드 콘텐츠 영역                          │
│          │  ┌──────────────────────────────────────┐    │
│ ✅ 1.기업 │  │  실습 1: 고객 리서치                  │    │
│    리서치 │  │                                      │    │
│ ▶ 2.콜   │  │  시나리오: 삼성SDS와의 미팅을 앞두고   │    │
│    준비   │  │  있습니다. 기업 정보를 조사해봅시다.   │    │
│ ○ 3.아웃  │  │                                      │    │
│    리치   │  │  ┌────────────────────────────────┐  │    │
│ ○ 4.브리  │  │  │ 💡 다음 명령어를 입력하세요:     │  │    │
│    핑     │  │  │                                │  │    │
│ ○ 5.파이  │  │  │ /sales:account-research        │  │    │
│    프라인 │  │  │                    [📋 복사]    │  │    │
│          │  │  └────────────────────────────────┘  │    │
│          │  │                                      │    │
│          │  │  ┌────────────────────────────────┐  │    │
│          │  │  │ 🖥️ 시뮬레이션 터미널            │  │    │
│          │  │  │                                │  │    │
│          │  │  │ $ /sales:account-research      │  │    │
│          │  │  │ > 삼성SDS에 대해 리서치해줘...  │  │    │
│          │  │  │                                │  │    │
│          │  │  │ ═══ 결과 ═══                   │  │    │
│          │  │  │ 📊 기업 개요                    │  │    │
│          │  │  │ 📈 주가 차트                    │  │    │
│          │  │  │ 📋 경영진 정보                  │  │    │
│          │  │  └────────────────────────────────┘  │    │
│          │  │                                      │    │
│          │  │    [◀ 이전]  [힌트 💡]  [다음 ▶]      │    │
│          │  └──────────────────────────────────────┘    │
├──────────┴──────────────────────────────────────────────┤
│  🏆 이 단계 완료! +50 XP           [다음 단계로 →]       │
└─────────────────────────────────────────────────────────┘
```

#### 기능 상세

| 기능 | 설명 |
|------|------|
| **스텝 네비게이션** | 왼쪽 사이드바에서 단계별 진행, 완료/진행중/미완료 상태 표시 |
| **명령어 코드블록** | 하이라이팅 + 원클릭 복사 버튼 |
| **시뮬레이션 터미널** | 명령어 입력 → 미리 준비된 시뮬레이션 결과 표시 |
| **결과 리치 렌더링** | 표, 차트, 대시보드 등 실제와 유사한 형태로 결과 렌더링 |
| **힌트 시스템** | 막힐 때 단계별 힌트 제공 (최대 3단계) |
| **진행률 저장** | localStorage + 서버 동기화로 진행 상태 유지 |

### 4.2 명령어 시뮬레이터 (Sandbox)

실제 Claude Code 없이도 플러그인 명령어를 체험할 수 있는 시뮬레이션 환경.

#### 동작 방식

```
[사용자 입력]                    [시스템 처리]                [결과 표시]

"삼성전자 주가 알려줘"  ──→  키워드 매칭           ──→  시뮬레이션 주가 카드
                              "주가" + "삼성전자"         + 차트 렌더링

"/sales:call-prep"    ──→  명령어 매칭           ──→  시뮬레이션 콜 준비
                              "/sales:call-prep"        리포트 렌더링

"/finance:reconciliation" → 명령어 매칭           ──→  시뮬레이션 계정 대조
                              "/finance:*"               표 렌더링
```

#### 모드

| 모드 | 설명 | API 호출 |
|------|------|---------|
| **Sandbox** (기본) | 미리 준비된 샘플 데이터로 시뮬레이션 | 없음 |
| **Live** (선택) | 실제 Alpha Vantage API로 실시간 데이터 조회 | 있음 |

#### Sandbox 시나리오 데이터셋

각 튜토리얼에 대응하는 시뮬레이션 데이터:

```
data/
├── sandbox/
│   ├── stocks/
│   │   ├── AAPL.json          # Apple 시뮬레이션 주가
│   │   ├── MSFT.json          # Microsoft
│   │   ├── SMSN.json          # 삼성전자
│   │   └── ...
│   ├── financials/
│   │   ├── income-statement-sample.json
│   │   ├── balance-sheet-sample.json
│   │   └── reconciliation-sample.json
│   ├── sales/
│   │   ├── account-research-sds.json
│   │   ├── call-prep-sample.json
│   │   ├── pipeline-sample.json
│   │   └── forecast-sample.json
│   └── customer-support/
│       ├── triage-sample.json
│       └── response-sample.json
```

### 4.3 실시간 금융 데이터 시각화

Alpha Vantage MCP와 연동하여 실제 데이터를 시각적으로 표현.

#### 차트 종류

| 차트 | 용도 | 라이브러리 |
|------|------|-----------|
| **캔들스틱** | 주가 시계열 | Lightweight Charts (TradingView) |
| **라인 차트** | 이동평균, 기술적 지표 | Recharts |
| **바 차트** | 거래량, 매출 비교 | Recharts |
| **도넛/파이** | 포트폴리오 비중, 지역별 매출 | Recharts |
| **히트맵** | 종목 간 상관관계 | Custom SVG |
| **퍼널** | 영업 파이프라인 | Custom |
| **게이지** | 목표 달성률, RSI | Custom SVG |
| **워터폴** | 예산 분석 (Variance) | Recharts |

#### 인터랙티브 요소

```
┌─────────────────────────────────────────────┐
│  AAPL 주가 차트                    [1D][1W][1M][3M][1Y] │
│                                                          │
│  ┌─────────────────────────────────────┐                │
│  │         📈 캔들스틱 차트             │                │
│  │    ┌─┐                              │                │
│  │    │ │  ┌─┐     ┌─┐                 │                │
│  │  ┌─┤ │  │ │ ┌─┐ │ │  ┌─┐           │                │
│  │  │ │ │  │ │ │ │ │ │  │ │           │                │
│  │  └─┘ └──┘ └─┘ └─┘ └──┘ └──         │                │
│  │  ─── SMA(20)  ─── EMA(60)          │                │
│  └─────────────────────────────────────┘                │
│                                                          │
│  📊 지표 오버레이:                                       │
│  [✅ SMA 20] [✅ EMA 60] [☐ 볼린저밴드] [☐ VWAP]       │
│                                                          │
│  📉 하단 패널:                                           │
│  [RSI] [MACD] [거래량] [스토캐스틱]                      │
│  ┌─────────────────────────────────────┐                │
│  │  RSI(14): 62.4  ── 과매수 70 ──     │                │
│  │  ████████████████░░░░░░░░░░░░░░░░░  │                │
│  │                  ── 과매도 30 ──     │                │
│  └─────────────────────────────────────┘                │
└──────────────────────────────────────────────────────────┘
```

### 4.4 학습 진행 관리

#### 진행률 대시보드

```
┌──────────────────────────────────────────────┐
│  🎯 나의 학습 현황                            │
│                                              │
│  전체 진행률                                  │
│  ████████████████░░░░░░░░  62% (5/8 완료)    │
│                                              │
│  ┌──────┬──────┬──────┐                     │
│  │ 초급  │ 중급  │ 고급  │                     │
│  │ ✅✅  │ ✅✅✅ │ ○○   │                     │
│  │100%  │ 75%  │ 0%   │                     │
│  └──────┴──────┴──────┘                     │
│                                              │
│  🏆 획득 배지: 5개                            │
│  [🌟 첫 조회] [📊 차트마스터] [💼 영업프로]    │
│  [📈 지표분석가] [🔄 워크플로우]               │
│                                              │
│  ⏱️ 총 학습 시간: 3시간 20분                   │
│  🔥 연속 학습: 5일째                          │
└──────────────────────────────────────────────┘
```

#### 배지 시스템

| 배지 | 조건 | XP |
|------|------|-----|
| 🌟 첫 걸음 | 튜토리얼 01 완료 | 50 |
| 📊 주식 초보 | 첫 주가 조회 성공 | 30 |
| 💼 영업 프로 | 튜토리얼 03 전체 완료 | 100 |
| 📈 지표 분석가 | 기술적 지표 5개 이상 조회 | 80 |
| 💰 재무 전문가 | 튜토리얼 04 전체 완료 | 100 |
| 📉 데이터 사이언티스트 | 대시보드 1개 생성 | 120 |
| 🛡️ 고객 히어로 | 튜토리얼 07 전체 완료 | 100 |
| 🚀 마스터 | 전체 튜토리얼 완료 | 500 |
| 🔥 연속 학습자 | 5일 연속 접속 | 50 |
| 👑 리더 | 팀 내 1등 달성 | 200 |

#### 팀 리더보드

```
┌─────────────────────────────────────┐
│  🏆 이번 주 리더보드                 │
│                                     │
│  1. 🥇 박분석   1,250 XP  ████████ │
│  2. 🥈 이전략   1,100 XP  ███████  │
│  3. 🥉 김영업     850 XP  █████    │
│  4.    최대리     620 XP  ████     │
│  5.    정사원     400 XP  ███      │
│                                     │
│     나의 순위: 3위 (850 XP)         │
└─────────────────────────────────────┘
```

### 4.5 퀴즈 & 평가

#### 단원별 퀴즈 (객관식 + 실습형)

```
┌─────────────────────────────────────────────┐
│  📝 튜토리얼 03 퀴즈: 영업 플러그인          │
│                                             │
│  Q1. 고객 리서치 명령어는?                    │
│  ○ /sales:forecast                          │
│  ● /sales:account-research                  │
│  ○ /sales:call-prep                         │
│  ○ /sales:pipeline-review                   │
│                                  [정답 ✅]   │
│                                             │
│  Q2. (실습형) 아래 파이프라인 데이터로        │
│  매출 예측 명령어를 작성하세요:               │
│  ┌──────────────────────────────────┐       │
│  │ 여기에 입력...                     │       │
│  └──────────────────────────────────┘       │
│                          [제출] [힌트]       │
│                                             │
│  진행: ██████░░░░ 2/5                       │
└─────────────────────────────────────────────┘
```

#### 종합 시나리오 평가

실제 영업 시나리오를 처음부터 끝까지 수행하는 종합 평가:

```
시나리오: "신규 고객 A은행에 금융 데이터 플랫폼을 제안하라"

Step 1: 기업 리서치  → 어떤 명령어를 사용할 것인가?
Step 2: 재무 분석    → 어떤 데이터를 조회할 것인가?
Step 3: 콜 준비      → 어떤 정보를 포함시킬 것인가?
Step 4: 제안서 작성  → 어떤 포인트를 강조할 것인가?
Step 5: 팔로업       → 어떤 액션 아이템을 도출할 것인가?

채점: 각 Step별 적절한 명령어 선택 + 입력 품질
```

### 4.6 Playground (자유 실습)

튜토리얼 외에 자유롭게 플러그인을 실험할 수 있는 공간.

```
┌──────────────────────────────────────────────────────┐
│  🎮 Playground                                        │
│                                                      │
│  모드: [Sandbox ▼]    플러그인: [Sales ▼]             │
│                                                      │
│  ┌─────────────────────────────────────────────────┐ │
│  │ 📝 프롬프트 입력                                  │ │
│  │                                                 │ │
│  │ 삼성SDS에 대해 리서치하고 콜 준비 자료를          │ │
│  │ 만들어줘. 주가 분석도 포함해서.                   │ │
│  │                                                 │ │
│  │                                    [실행 ▶️]     │ │
│  └─────────────────────────────────────────────────┘ │
│                                                      │
│  ┌─────────────────────────────────────────────────┐ │
│  │ 📊 결과                                          │ │
│  │                                                 │ │
│  │ [기업 개요] [주가 차트] [콜 준비 리포트]          │ │
│  │                                                 │ │
│  │ ┌─── 기업 개요 ──────────────────────────────┐  │ │
│  │ │ 삼성SDS (018260.KS)                        │  │ │
│  │ │ 설립: 1985년 / 매출: 13.3조원               │  │ │
│  │ │ 주요 서비스: 클라우드, AI, 보안, SI          │  │ │
│  │ │ ...                                        │  │ │
│  │ └───────────────────────────────────────────┘  │ │
│  └─────────────────────────────────────────────────┘ │
│                                                      │
│  💡 추천 명령어: /sales:competitive-intelligence      │
└──────────────────────────────────────────────────────┘
```

### 4.7 레퍼런스 (명령어 사전)

```
┌──────────────────────────────────────────────────────┐
│  📖 명령어 레퍼런스          🔍 [검색...]             │
│                                                      │
│  필터: [전체] [Sales] [Finance] [Data] [Support]     │
│                                                      │
│  ┌────────────────────────────────────────────────┐  │
│  │ /sales:account-research                        │  │
│  │                                                │  │
│  │ 📋 설명: 기업 또는 인물에 대한 영업 인텔리전스   │  │
│  │          리서치를 수행합니다.                    │  │
│  │                                                │  │
│  │ 💡 사용 예시:                                   │  │
│  │ "삼성SDS에 대해 리서치해줘"                     │  │
│  │ "카카오뱅크 CTO에 대해 조사해줘"                │  │
│  │                                    [📋 복사]   │  │
│  │                                                │  │
│  │ 🔗 관련 명령어:                                 │  │
│  │ /sales:call-prep  /sales:draft-outreach        │  │
│  │                                                │  │
│  │ 📚 튜토리얼: #03 영업 플러그인 활용             │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│  ┌────────────────────────────────────────────────┐  │
│  │ /sales:call-prep                               │  │
│  │ ...                                            │  │
│  └────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
```

---

## 5. 기술 아키텍처

### 5.1 기술 스택

| 레이어 | 기술 | 선정 이유 |
|--------|------|----------|
| **프레임워크** | Next.js 15 (App Router) | SSR, API Routes, 빠른 개발 |
| **언어** | TypeScript | 타입 안전성, 개발 생산성 |
| **UI 라이브러리** | Tailwind CSS + shadcn/ui | 모던 디자인, 커스터마이징 용이 |
| **차트** | Recharts + Lightweight Charts | 금융 차트 특화, React 호환 |
| **애니메이션** | Framer Motion | 풍부한 인터랙션 |
| **터미널 시뮬레이션** | xterm.js | 실제 터미널 느낌 |
| **코드 에디터** | Monaco Editor (경량) | VS Code 수준 하이라이팅 |
| **콘텐츠** | MDX (next-mdx-remote) | 마크다운 + React 컴포넌트 |
| **상태관리** | Zustand | 경량, 간편 |
| **데이터 저장** | localStorage + SQLite | 진행률, 설정 저장 |
| **API 프록시** | Next.js API Routes | Alpha Vantage API 키 보호 |
| **배포** | Vercel / Docker | 간편 배포, 자체 호스팅 가능 |

### 5.2 시스템 아키텍처

```
┌─────────────┐     ┌──────────────────────────────────────┐
│             │     │  Next.js Application                  │
│  Browser    │     │                                      │
│  (Client)   │◄───►│  ┌──────────┐  ┌──────────────────┐ │
│             │     │  │ App      │  │ API Routes       │ │
│  - React    │     │  │ Router   │  │                  │ │
│  - Charts   │     │  │          │  │ /api/stocks      │─┼──► Alpha Vantage
│  - Terminal │     │  │ Pages:   │  │ /api/financials   │─┼──► Financial Datasets
│  - MDX      │     │  │ /        │  │ /api/simulate    │ │
│             │     │  │ /dash    │  │ /api/progress    │ │
│             │     │  │ /tut/*   │  │                  │ │
│             │     │  │ /play    │  └──────────────────┘ │
│             │     │  │ /ref     │                        │
│             │     │  │ /quiz    │  ┌──────────────────┐ │
│             │     │  └──────────┘  │ SQLite           │ │
│             │     │                │ - users           │ │
│             │     │                │ - progress        │ │
│             │     │                │ - quiz_results    │ │
│             │     │                └──────────────────┘ │
└─────────────┘     └──────────────────────────────────────┘
```

### 5.3 디렉토리 구조

```
claude-finance-lab/
├── public/
│   ├── images/
│   │   ├── badges/             # 배지 아이콘
│   │   └── tutorials/          # 튜토리얼 이미지
│   └── sandbox-data/           # Sandbox 시뮬레이션 데이터
│       ├── stocks/
│       ├── financials/
│       ├── sales/
│       └── support/
│
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx            # 랜딩 페이지
│   │   ├── layout.tsx          # 공통 레이아웃
│   │   ├── dashboard/
│   │   │   └── page.tsx        # 학습 대시보드
│   │   ├── tutorials/
│   │   │   ├── page.tsx        # 튜토리얼 목록
│   │   │   └── [slug]/
│   │   │       └── page.tsx    # 개별 튜토리얼 뷰어
│   │   ├── playground/
│   │   │   └── page.tsx        # 자유 실습
│   │   ├── reference/
│   │   │   └── page.tsx        # 명령어 레퍼런스
│   │   ├── quiz/
│   │   │   ├── page.tsx        # 퀴즈 목록
│   │   │   └── [id]/
│   │   │       └── page.tsx    # 개별 퀴즈
│   │   └── api/
│   │       ├── stocks/
│   │       │   └── route.ts    # Alpha Vantage 프록시
│   │       ├── financials/
│   │       │   └── route.ts    # Financial Datasets 프록시
│   │       ├── simulate/
│   │       │   └── route.ts    # 시뮬레이션 엔진
│   │       └── progress/
│   │           └── route.ts    # 진행률 CRUD
│   │
│   ├── components/
│   │   ├── ui/                 # shadcn/ui 기본 컴포넌트
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Footer.tsx
│   │   ├── tutorial/
│   │   │   ├── TutorialViewer.tsx      # 튜토리얼 메인 뷰어
│   │   │   ├── StepNavigation.tsx      # 단계 네비게이션
│   │   │   ├── CommandBlock.tsx        # 명령어 블록 (복사 기능)
│   │   │   ├── SimulatorTerminal.tsx   # 시뮬레이션 터미널
│   │   │   ├── ResultRenderer.tsx      # 결과 리치 렌더링
│   │   │   └── HintSystem.tsx          # 힌트 시스템
│   │   ├── charts/
│   │   │   ├── CandlestickChart.tsx    # 캔들스틱 (주가)
│   │   │   ├── LineChart.tsx           # 라인 (이동평균)
│   │   │   ├── BarChart.tsx            # 바 (거래량, 매출)
│   │   │   ├── PieChart.tsx            # 도넛/파이
│   │   │   ├── FunnelChart.tsx         # 퍼널 (파이프라인)
│   │   │   ├── GaugeChart.tsx          # 게이지 (RSI, 달성률)
│   │   │   ├── WaterfallChart.tsx      # 워터폴 (분산분석)
│   │   │   └── HeatmapChart.tsx        # 히트맵 (상관관계)
│   │   ├── financial/
│   │   │   ├── IncomeStatement.tsx     # 손익계산서 테이블
│   │   │   ├── BalanceSheet.tsx        # 대차대조표
│   │   │   ├── StockCard.tsx           # 종목 시세 카드
│   │   │   └── TechnicalPanel.tsx      # 기술적 지표 패널
│   │   ├── gamification/
│   │   │   ├── ProgressRing.tsx        # 원형 진행률
│   │   │   ├── BadgeDisplay.tsx        # 배지 표시
│   │   │   ├── Leaderboard.tsx         # 리더보드
│   │   │   └── XPNotification.tsx      # XP 획득 알림
│   │   └── playground/
│   │       ├── PromptInput.tsx         # 프롬프트 입력
│   │       └── ResultPanel.tsx         # 결과 패널
│   │
│   ├── content/
│   │   └── tutorials/          # MDX 튜토리얼 콘텐츠
│   │       ├── 01-getting-started.mdx
│   │       ├── 02-stock-lookup.mdx
│   │       ├── 03-sales-basics.mdx
│   │       ├── 04-financial-analysis.mdx
│   │       ├── 05-data-analysis.mdx
│   │       ├── 06-technical-indicators.mdx
│   │       ├── 07-customer-management.mdx
│   │       └── 08-advanced-workflows.mdx
│   │
│   ├── lib/
│   │   ├── alpha-vantage.ts    # Alpha Vantage API 클라이언트
│   │   ├── simulator.ts        # 명령어 시뮬레이션 엔진
│   │   ├── progress.ts         # 진행률 관리
│   │   ├── quiz.ts             # 퀴즈 로직
│   │   └── badges.ts           # 배지 시스템
│   │
│   ├── stores/
│   │   ├── useProgressStore.ts # 진행률 상태
│   │   ├── useUserStore.ts     # 사용자 상태
│   │   └── useSimulatorStore.ts # 시뮬레이터 상태
│   │
│   └── types/
│       ├── tutorial.ts
│       ├── stock.ts
│       ├── financial.ts
│       └── quiz.ts
│
├── prisma/                     # (옵션) DB 스키마
│   └── schema.prisma
│
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## 6. 데이터 모델

### 6.1 사용자 진행률

```typescript
interface UserProgress {
  userId: string
  tutorials: {
    [tutorialSlug: string]: {
      status: 'not_started' | 'in_progress' | 'completed'
      currentStep: number
      totalSteps: number
      completedSteps: number[]
      startedAt: string     // ISO date
      completedAt?: string
      timeSpentSeconds: number
    }
  }
  badges: string[]           // 획득한 배지 ID 목록
  totalXP: number
  streakDays: number
  lastActiveDate: string
}
```

### 6.2 튜토리얼 콘텐츠

```typescript
interface Tutorial {
  slug: string
  title: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedMinutes: number
  plugins: string[]          // 사용하는 플러그인 목록
  steps: TutorialStep[]
}

interface TutorialStep {
  id: number
  title: string
  content: string            // MDX 콘텐츠
  type: 'guide' | 'exercise' | 'quiz'
  command?: {
    text: string             // 실행할 명령어
    plugin: string           // 관련 플러그인
    sandboxResponse: string  // 시뮬레이션 응답 ID
  }
  hints?: string[]           // 힌트 (최대 3개)
  expectedResult?: string    // 예상 결과 설명
  xpReward: number
}
```

### 6.3 시뮬레이션 응답

```typescript
interface SimulationResponse {
  id: string
  command: string
  triggerKeywords: string[]
  response: {
    type: 'text' | 'table' | 'chart' | 'report' | 'mixed'
    content: any             // 타입별 다른 형식
  }
  charts?: ChartConfig[]     // 차트 렌더링 설정
}

interface ChartConfig {
  type: 'candlestick' | 'line' | 'bar' | 'pie' | 'funnel' | 'gauge'
  title: string
  data: any[]
  options: Record<string, any>
}
```

### 6.4 퀴즈

```typescript
interface Quiz {
  id: string
  tutorialSlug: string
  title: string
  questions: QuizQuestion[]
  passingScore: number       // 합격 점수 (%)
}

interface QuizQuestion {
  id: number
  type: 'multiple_choice' | 'command_input' | 'scenario'
  question: string
  options?: string[]         // 객관식 보기
  correctAnswer: string | string[]
  explanation: string        // 정답 해설
  points: number
}
```

---

## 7. API 설계

### 7.1 주가 데이터 프록시

```
GET /api/stocks/quote?symbol=AAPL
GET /api/stocks/daily?symbol=AAPL&outputsize=compact
GET /api/stocks/indicator?symbol=AAPL&indicator=RSI&period=14
GET /api/stocks/search?keywords=Samsung
```

### 7.2 재무 데이터 프록시

```
GET /api/financials/income?symbol=AAPL
GET /api/financials/balance?symbol=AAPL
GET /api/financials/cashflow?symbol=AAPL
GET /api/financials/overview?symbol=AAPL
```

### 7.3 시뮬레이션

```
POST /api/simulate
Body: { command: "/sales:call-prep", input: "삼성SDS 미팅 준비..." }
Response: { type: "report", content: {...}, charts: [...] }
```

### 7.4 진행률

```
GET    /api/progress/:userId
PUT    /api/progress/:userId/tutorials/:slug
POST   /api/progress/:userId/badges
GET    /api/progress/leaderboard
```

### 7.5 퀴즈

```
GET    /api/quiz/:tutorialSlug
POST   /api/quiz/:tutorialSlug/submit
Body: { answers: [...] }
Response: { score: 80, passed: true, results: [...] }
```

---

## 8. UI/UX 디자인 가이드

### 8.1 컬러 시스템

```
Primary:     #2563EB (Blue 600)   - 주요 액션, 링크
Secondary:   #7C3AED (Violet 600) - 보조 액션, 배지
Success:     #059669 (Emerald 600)- 완료, 상승
Warning:     #D97706 (Amber 600)  - 주의, 진행중
Danger:      #DC2626 (Red 600)    - 에러, 하락
Background:  #0F172A (Slate 900)  - 다크 모드 배경
Surface:     #1E293B (Slate 800)  - 카드 배경
Text:        #F8FAFC (Slate 50)   - 주요 텍스트
TextMuted:   #94A3B8 (Slate 400)  - 보조 텍스트
```

### 8.2 디자인 원칙

| 원칙 | 설명 |
|------|------|
| **다크 모드 우선** | 금융 터미널 느낌의 다크 테마 기본 (라이트 모드 지원) |
| **정보 밀도** | 한 화면에 충분한 정보, 하지만 압도하지 않게 |
| **인터랙티브** | 모든 데이터 요소는 호버/클릭 가능 |
| **즉각적 피드백** | 액션에 대한 애니메이션, 토스트 알림 |
| **접근성** | 키보드 네비게이션, 스크린 리더 지원 |

### 8.3 반응형 브레이크포인트

| 브레이크포인트 | 레이아웃 |
|--------------|---------|
| Mobile (< 768px) | 단일 컬럼, 하단 네비게이션 |
| Tablet (768~1024px) | 접히는 사이드바 |
| Desktop (> 1024px) | 풀 레이아웃 (사이드바 + 메인 + 패널) |

---

## 9. Sandbox 시뮬레이션 시나리오

각 튜토리얼별로 미리 준비할 시뮬레이션 데이터 목록:

### Tutorial 01~02: 주식 조회

| 명령어/키워드 | 시뮬레이션 응답 |
|-------------|---------------|
| "AAPL 주가" | Apple 시세 카드 + 미니 차트 |
| "삼성전자 주가" | 삼성전자 시세 카드 (KRW) |
| "USD/KRW 환율" | 환율 카드 + 추이 차트 |
| "AAPL 기업 개요" | 기업 정보 테이블 + 핵심 지표 |
| "Apple 손익계산서" | 재무제표 테이블 (4분기) |

### Tutorial 03: 영업

| 명령어 | 시뮬레이션 응답 |
|--------|---------------|
| `/sales:account-research` | 삼성SDS 기업 리포트 |
| `/sales:call-prep` | 미팅 준비 체크리스트 + 아젠다 |
| `/sales:draft-outreach` | 이메일 초안 (편집 가능) |
| `/sales:daily-briefing` | 일일 브리핑 카드 |
| `/sales:pipeline-review` | 파이프라인 퍼널 차트 + 분석 |
| `/sales:forecast` | 매출 예측 표 + 시나리오 차트 |
| `/sales:call-summary` | 미팅 요약 + 액션 아이템 |

### Tutorial 04: 재무

| 명령어 | 시뮬레이션 응답 |
|--------|---------------|
| `/finance:financial-statements` | 손익계산서 렌더링 |
| `/finance:journal-entry-prep` | 분개장 (차변/대변 표) |
| `/finance:reconciliation` | 계정 대조표 + 차이 분석 |
| `/finance:variance-analysis` | 워터폴 차트 + 분석 리포트 |
| `/finance:close-management` | 결산 타임라인 (간트 차트) |

### Tutorial 05: 데이터

| 명령어 | 시뮬레이션 응답 |
|--------|---------------|
| `/data:write-query` | SQL 코드 블록 (하이라이팅) |
| `/data:analyze` | 분석 결과 표 + 차트 |
| `/data:explore-data` | 데이터 프로파일 리포트 |
| `/data:build-dashboard` | 인터랙티브 대시보드 미리보기 |
| `/data:create-viz` | Python 차트 이미지 |

### Tutorial 06: 기술적 지표

| 명령어 | 시뮬레이션 응답 |
|--------|---------------|
| RSI 조회 | RSI 게이지 + 추이 차트 |
| MACD 조회 | MACD 라인차트 + 히스토그램 |
| 볼린저밴드 | 밴드 오버레이 차트 |
| 종합 분석 | 멀티 지표 대시보드 |

### Tutorial 07: 고객 지원

| 명령어 | 시뮬레이션 응답 |
|--------|---------------|
| `/customer-support:triage` | 우선순위 배지 + 라우팅 |
| `/customer-support:draft-response` | 이메일 초안 (편집 가능) |
| `/customer-support:escalate` | 에스컬레이션 리포트 |
| `/customer-support:kb-article` | KB 문서 미리보기 |

---

## 10. 마일스톤 & 개발 계획

### Phase 1: MVP (2주)

**목표**: 기본 학습 플랫폼 + 튜토리얼 뷰어

| 주차 | 작업 | 산출물 |
|------|------|--------|
| 1주차 | 프로젝트 셋업, 랜딩, 튜토리얼 목록 | 기본 페이지 구조 |
| 1주차 | MDX 튜토리얼 콘텐츠 변환 | 8개 튜토리얼 MDX |
| 2주차 | 튜토리얼 뷰어 (스텝 네비게이션) | 인터랙티브 뷰어 |
| 2주차 | 명령어 코드블록 + 복사 기능 | CommandBlock 컴포넌트 |
| 2주차 | 기본 진행률 (localStorage) | 체크리스트 |

### Phase 2: 인터랙티브 (3주)

**목표**: 시뮬레이터 + 차트 + 게이미피케이션

| 주차 | 작업 | 산출물 |
|------|------|--------|
| 3주차 | Sandbox 시뮬레이터 엔진 | 명령어 매칭 + 응답 |
| 3주차 | 시뮬레이션 터미널 UI | SimulatorTerminal |
| 4주차 | 금융 차트 컴포넌트 | 캔들스틱, 라인, 바, 게이지 |
| 4주차 | 재무제표 렌더링 컴포넌트 | 표, 워터폴, 퍼널 |
| 5주차 | 배지/XP 시스템 | 게이미피케이션 |
| 5주차 | 퀴즈 시스템 | 단원별 퀴즈 |

### Phase 3: 라이브 & 고급 (3주)

**목표**: 실시간 데이터 + Playground + 리더보드

| 주차 | 작업 | 산출물 |
|------|------|--------|
| 6주차 | Alpha Vantage 프록시 API | 실시간 데이터 연동 |
| 6주차 | Live 모드 차트 | 실시간 주가 차트 |
| 7주차 | Playground (자유 실습) | 프롬프트 입력 + 결과 |
| 7주차 | 레퍼런스 페이지 | 명령어 사전 + 검색 |
| 8주차 | 리더보드 + 팀 기능 | 순위, 통계 |
| 8주차 | 종합 시나리오 평가 | 실전 평가 |

### Phase 4: 고도화 (선택)

- 다국어 지원 (영어)
- 모바일 최적화
- SSO 연동 (사내 인증)
- 학습 분석 대시보드 (관리자용)
- 커스텀 튜토리얼 작성 도구

---

## 11. 성공 지표 (KPI)

| 지표 | 목표 | 측정 방법 |
|------|------|----------|
| **학습 완료율** | 80% 이상 (튜토리얼 01~03) | 진행률 데이터 |
| **일일 활성 사용자 (DAU)** | 영업부서 인원의 60% | 접속 로그 |
| **평균 학습 시간** | 주 2시간 이상 | 세션 시간 |
| **퀴즈 합격률** | 70% 이상 | 퀴즈 결과 |
| **실제 플러그인 사용 전환율** | 50% 이상 | Claude Code 사용 로그 |
| **NPS (순추천지수)** | 40 이상 | 설문조사 |

---

## 12. 리스크 & 완화 방안

| 리스크 | 영향 | 완화 방안 |
|--------|------|----------|
| Alpha Vantage API 제한 (무료 500콜/일) | Live 모드 제한 | Sandbox 모드 기본, 캐싱 적극 활용 |
| 영업부서 참여 저조 | 학습 효과 없음 | 게이미피케이션, 팀 경쟁, 관리자 모니터링 |
| 콘텐츠 노후화 | 실습 결과 불일치 | MDX 기반으로 쉽게 업데이트 가능 |
| 보안 (API 키 노출) | 과금 문제 | 서버 사이드 프록시, 환경변수 |
| 브라우저 호환성 | UI 깨짐 | Chrome/Edge 기준, E2E 테스트 |

---

## 13. 부록: 핵심 컴포넌트 명세

### SimulatorTerminal

시뮬레이션 터미널의 상세 동작:

```
입력 처리 흐름:

1. 사용자 타이핑 → 자동완성 제안 (명령어 목록)
2. Enter 입력 → 타이핑 애니메이션으로 명령어 표시
3. "처리 중..." 로딩 애니메이션 (0.5~2초)
4. Sandbox: 매칭된 시뮬레이션 응답 렌더링
   Live: Alpha Vantage API 호출 → 실제 데이터 렌더링
5. 결과에 따라 적절한 컴포넌트 렌더링:
   - 텍스트 → 마크다운 렌더링
   - 표 → DataTable 컴포넌트
   - 차트 → Chart 컴포넌트 (애니메이션)
   - 리포트 → 카드 레이아웃
```

### ResultRenderer

결과 타입별 렌더링 전략:

| 결과 타입 | 렌더링 컴포넌트 | 예시 |
|----------|----------------|------|
| stock_quote | StockCard | 종목 시세 카드 |
| stock_chart | CandlestickChart | 주가 캔들스틱 |
| indicator | GaugeChart + LineChart | RSI 게이지 + 추이 |
| financial_statement | DataTable | 재무제표 표 |
| pipeline | FunnelChart | 파이프라인 퍼널 |
| forecast | BarChart + Table | 예측 차트 + 표 |
| email_draft | EditableCard | 편집 가능한 이메일 |
| report | CardLayout | 리포트 카드들 |
| sql | CodeBlock | SQL 하이라이팅 |
| dashboard | DashboardPreview | 미니 대시보드 |
