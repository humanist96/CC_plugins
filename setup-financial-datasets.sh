#!/bin/bash
# Financial Datasets MCP 서버 단독 설치 스크립트
# 사용법:
#   원격: bash setup-financial-datasets.sh remote
#   로컬: FINANCIAL_DATASETS_API_KEY=your_key bash setup-financial-datasets.sh local

set -euo pipefail

MODE="${1:-remote}"
INSTALL_DIR="/Users/koscom/@work/cc_plugins/financial-datasets-mcp"

setup_remote() {
    echo "Financial Datasets MCP (원격 서버) 등록 중..."
    claude mcp add --transport http financial-datasets \
        "https://api.financialdatasets.ai/mcp"

    echo ""
    echo "원격 서버 등록 완료!"
    echo "참고: API 인증이 필요한 경우 financialdatasets.ai에서 키를 발급받으세요."
}

setup_local() {
    local API_KEY="${FINANCIAL_DATASETS_API_KEY:-}"

    if [ -z "$API_KEY" ]; then
        echo "Financial Datasets API 키가 필요합니다."
        echo "발급: https://financialdatasets.ai/"
        echo ""
        read -rp "API Key 입력: " API_KEY
    fi

    if [ -z "$API_KEY" ]; then
        echo "API 키가 입력되지 않았습니다. 종료합니다."
        exit 1
    fi

    # uv 확인
    if ! command -v uv &>/dev/null; then
        echo "uv가 필요합니다. 설치 중..."
        curl -LsSf https://astral.sh/uv/install.sh | sh
        export PATH="$HOME/.local/bin:$PATH"
    fi

    # 리포지토리 클론
    if [ -d "$INSTALL_DIR" ]; then
        echo "기존 설치 발견 - 업데이트 중..."
        cd "$INSTALL_DIR" && git pull
    else
        echo "리포지토리 클론 중..."
        git clone https://github.com/financial-datasets/mcp-server.git "$INSTALL_DIR"
    fi

    cd "$INSTALL_DIR"

    # 가상환경 + 의존성
    echo "Python 환경 설정 중..."
    uv venv
    source .venv/bin/activate
    uv pip install "mcp[cli]" httpx python-dotenv

    # .env 파일
    echo "FINANCIAL_DATASETS_API_KEY=${API_KEY}" > .env

    # Claude MCP 등록
    local UV_PATH
    UV_PATH="$(which uv)"

    claude mcp add --transport stdio financial-datasets \
        --env "FINANCIAL_DATASETS_API_KEY=${API_KEY}" \
        -- "$UV_PATH" --directory "$INSTALL_DIR" run server.py

    deactivate 2>/dev/null || true

    echo ""
    echo "로컬 서버 설치 및 등록 완료!"
}

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " Financial Datasets MCP 서버 설치"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

case "$MODE" in
    remote)
        setup_remote
        ;;
    local)
        setup_local
        ;;
    *)
        echo "사용법: $0 [remote|local]"
        echo "  remote - 원격 API 서버 연결 (간편)"
        echo "  local  - 로컬 서버 설치 (고급)"
        exit 1
        ;;
esac

echo ""
echo "테스트 방법 (Claude Code 내에서):"
echo '  "Apple의 최근 손익계산서 보여줘"'
echo '  "Tesla 대차대조표 분석해줘"'
echo '  "MSFT 현재 주가는?"'
echo ""
echo "제공 도구:"
echo "  - get_income_statements: 손익계산서"
echo "  - get_balance_sheets: 대차대조표"
echo "  - get_cash_flow_statements: 현금흐름표"
echo "  - get_current_stock_price: 현재 주가"
echo "  - get_historical_stock_prices: 과거 주가"
echo "  - get_company_news: 기업 뉴스"
echo "  - get_sec_filings: SEC 공시"
echo "  - get_crypto_prices: 암호화폐 가격"
