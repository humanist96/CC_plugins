# 금융영업부서용 Claude 플러그인 & MCP 서버

금융영업부서에서 활용할 Claude Code 플러그인과 MCP 서버 설치/설정 도구.

## 빠른 시작

```bash
# 전체 설치 (플러그인 + MCP 서버)
bash setup-finance-plugins.sh

# 또는 Phase별 개별 설치
bash setup-finance-plugins.sh 1       # Phase 1: 플러그인만
bash setup-finance-plugins.sh 2       # Phase 2: MCP 서버만
bash setup-finance-plugins.sh verify  # 설치 검증
```

## 설치 스크립트

| 스크립트 | 용도 |
|---------|------|
| `setup-finance-plugins.sh` | 통합 설치 (Phase 1 + 2) |
| `setup-alphavantage.sh` | Alpha Vantage MCP 단독 설치 |
| `setup-financial-datasets.sh` | Financial Datasets MCP 단독 설치 |
| `setup-extra-plugins.sh` | 추가/선택 플러그인 설치 |

## Phase 1: 플러그인

### 핵심 (3개)

| 플러그인 | 주요 기능 | 명령어 |
|---------|----------|--------|
| **sales** | 고객 리서치, 콜 준비, 파이프라인 | `/call-prep` `/forecast` `/pipeline-review` |
| **finance** | 분개장, 계정 대조, 재무제표 | `/journal-entry` `/reconciliation` `/income-statement` |
| **data** | SQL 쿼리, 통계분석, 대시보드 | `/analyze` `/write-query` `/build-dashboard` |

### 추가 (3개)

| 플러그인 | 주요 기능 | 명령어 |
|---------|----------|--------|
| **customer-support** | 티켓 분류, 응답 작성, KB 관리 | `/triage` `/draft-response` `/kb-article` |
| **enterprise-search** | 전사 통합 검색 | `/enterprise-search:search` `/enterprise-search:digest` |
| **productivity** | 업무 관리, 메모리, 대시보드 | `/start` `/update` |

## Phase 2: MCP 서버

### Alpha Vantage (주식/외환/암호화폐)

```bash
# API 키 발급: https://www.alphavantage.co/ (무료: 500콜/일)
ALPHAVANTAGE_API_KEY=your_key bash setup-alphavantage.sh
```

제공 데이터: 주가 시계열, 기술적 지표 40+, 기업 펀더멘탈, 옵션, 경제지표, 외환, 암호화폐, 뉴스 감성분석

### Financial Datasets (기업 재무)

```bash
# 원격 (간편)
bash setup-financial-datasets.sh remote

# 로컬 (API 키 필요)
FINANCIAL_DATASETS_API_KEY=your_key bash setup-financial-datasets.sh local
```

제공 도구: 손익계산서, 대차대조표, 현금흐름표, 주가, 뉴스, SEC 공시, 암호화폐

## 검증

```bash
# CLI에서
bash setup-finance-plugins.sh verify

# Claude Code 내에서
/mcp                              # MCP 서버 상태 확인
# "AAPL 주가 조회해줘"            # Alpha Vantage 테스트
# "Apple 손익계산서 보여줘"        # Financial Datasets 테스트
# /forecast                       # Sales 플러그인 테스트
```

## API 키 요약

| 서비스 | 발급처 | 무료 티어 |
|--------|-------|----------|
| Alpha Vantage | https://www.alphavantage.co/ | 500콜/일, 5콜/분 |
| Financial Datasets | https://financialdatasets.ai/ | Freemium |

## 연동 서비스 (MCP 커넥터)

플러그인들은 다음 서비스와 MCP를 통해 연동 가능:

- **CRM**: HubSpot, Close, Intercom
- **데이터 웨어하우스**: Snowflake, Databricks, BigQuery
- **프로젝트 관리**: Asana, Linear, Jira, Monday.com
- **지식 베이스**: Notion, Guru
- **커뮤니케이션**: Slack, Microsoft 365
- **분석**: Amplitude, Hex
- **데이터 보강**: Clay, ZoomInfo, Fireflies
