#!/bin/bash
# Alpha Vantage MCP 서버 단독 설치 스크립트
# 사용법: ALPHAVANTAGE_API_KEY=your_key bash setup-alphavantage.sh
#   또는: bash setup-alphavantage.sh (대화형 입력)

set -euo pipefail

API_KEY="${ALPHAVANTAGE_API_KEY:-}"

if [ -z "$API_KEY" ]; then
    echo "Alpha Vantage API 키가 필요합니다."
    echo "무료 발급: https://www.alphavantage.co/support/#api-key"
    echo "(무료: 500콜/일, 5콜/분)"
    echo ""
    read -rp "API Key 입력: " API_KEY
fi

if [ -z "$API_KEY" ]; then
    echo "API 키가 입력되지 않았습니다. 종료합니다."
    exit 1
fi

echo "Alpha Vantage MCP 서버를 등록합니다..."
claude mcp add --transport http alphavantage \
    "https://mcp.alphavantage.co/mcp?apikey=${API_KEY}"

echo ""
echo "등록 완료! Claude Code에서 다음과 같이 테스트하세요:"
echo '  "AAPL 주가 조회해줘"'
echo '  "삼성전자 기술적 지표 분석해줘"'
echo '  "USD/KRW 환율 조회해줘"'
echo ""
echo "제공 기능:"
echo "  - 주가 시계열 (일간/주간/월간/장중)"
echo "  - 기술적 지표 40+ (RSI, MACD, 볼린저밴드 등)"
echo "  - 기업 펀더멘탈 (재무제표, 실적)"
echo "  - 옵션, 경제지표, 원자재, 외환, 암호화폐"
echo "  - 뉴스 감성분석, 내부자 거래"
