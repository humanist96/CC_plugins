# 금융영업부서 Claude 플러그인 실습 튜토리얼

금융영업부서에서 Claude Code 플러그인과 MCP 서버를 활용하기 위한 단계별 실습 가이드입니다.

## 커리큘럼

### 초급 (Beginner)

| # | 튜토리얼 | 내용 | 소요시간 |
|---|---------|------|---------|
| 01 | [시작하기](01-getting-started.md) | 환경 확인, 첫 명령어, 기본 조회 | 10분 |
| 02 | [주식 정보 조회 기초](02-stock-lookup.md) | 주가/환율 조회, 기업 정보, 재무제표 조회 | 15분 |

### 중급 (Intermediate)

| # | 튜토리얼 | 내용 | 소요시간 |
|---|---------|------|---------|
| 03 | [영업 플러그인 활용](03-sales-basics.md) | 고객 리서치, 콜 준비, 아웃리치, 파이프라인 | 20분 |
| 04 | [재무 분석 플러그인](04-financial-analysis.md) | 재무제표, 분개장, 계정 대조, 예산 분석 | 25분 |
| 05 | [데이터 분석과 시각화](05-data-analysis.md) | SQL 쿼리, 통계 분석, 대시보드 | 25분 |
| 07 | [고객 관리와 지원](07-customer-management.md) | 티켓 분류, 응답 작성, 에스컬레이션, KB | 20분 |

### 고급 (Advanced)

| # | 튜토리얼 | 내용 | 소요시간 |
|---|---------|------|---------|
| 06 | [기술적 지표 분석](06-technical-indicators.md) | RSI, MACD, 볼린저밴드, 종합 분석 | 30분 |
| 08 | [심화 워크플로우](08-advanced-workflows.md) | 플러그인 조합, End-to-End 시나리오, 자동화 | 30분 |

## 학습 경로

```
초급                    중급                         고급
┌──────────┐     ┌──────────────┐          ┌──────────────┐
│ 01 시작  │────▶│ 03 영업      │────┐     │ 06 기술 지표 │
│ 02 주식  │     │ 04 재무      │    ├────▶│ 08 심화      │
└──────────┘     │ 05 데이터    │    │     │    워크플로우 │
                 │ 07 고객 관리 │────┘     └──────────────┘
                 └──────────────┘
```

## 빠른 참조

### 플러그인별 주요 명령어

| 플러그인 | 핵심 명령어 | 튜토리얼 |
|---------|-----------|---------|
| Sales | `/sales:call-prep` `/sales:forecast` `/sales:pipeline-review` | #03 |
| Finance | `/finance:financial-statements` `/finance:journal-entry-prep` `/finance:reconciliation` | #04 |
| Data | `/data:analyze` `/data:write-query` `/data:build-dashboard` | #05 |
| Customer Support | `/customer-support:triage` `/customer-support:draft-response` | #07 |
| Enterprise Search | `/enterprise-search:search` `/enterprise-search:digest` | #07 |

### MCP 서버별 활용

| MCP 서버 | 주요 기능 | 튜토리얼 |
|---------|----------|---------|
| Alpha Vantage | 주가, 기술적 지표, 환율, 뉴스 | #02, #06 |
| Financial Datasets | 재무제표, SEC 공시 | #02, #04 |

## 사전 준비

튜토리얼을 시작하기 전에 다음을 확인하세요:

1. Claude Code 설치 완료
2. 플러그인 설치 완료 (`bash setup-finance-plugins.sh`)
3. MCP 서버 설정 완료 (Alpha Vantage API 키 필요)

설치가 안 되어 있다면 [README.md](../README.md)를 참고하세요.
