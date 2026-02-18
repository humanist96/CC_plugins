#!/bin/bash
# ============================================================
# 금융영업부서용 Claude 플러그인 & MCP 서버 설치 스크립트
# ============================================================
# 사용법: bash setup-finance-plugins.sh [phase]
#   phase 1: 플러그인 설치
#   phase 2: MCP 서버 설정
#   phase all: 전체 설치 (기본값)
# ============================================================

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info()  { echo -e "${BLUE}[INFO]${NC} $1"; }
log_ok()    { echo -e "${GREEN}[OK]${NC} $1"; }
log_warn()  { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }
log_header() { echo -e "\n${BLUE}========================================${NC}"; echo -e "${BLUE} $1${NC}"; echo -e "${BLUE}========================================${NC}"; }

PHASE="${1:-all}"

# ============================================================
# Phase 1: Anthropic 공식 플러그인 설치
# ============================================================
install_plugins() {
    log_header "Phase 1: knowledge-work-plugins 마켓플레이스 & 플러그인 설치"

    # 1-1. 마켓플레이스 추가
    log_info "마켓플레이스 추가: anthropics/knowledge-work-plugins"
    if claude plugin marketplace add anthropics/knowledge-work-plugins 2>/dev/null; then
        log_ok "knowledge-work-plugins 마켓플레이스 추가 완료"
    else
        log_warn "마켓플레이스가 이미 추가되어 있거나 추가 실패"
    fi

    echo ""

    # 1-2. 핵심 플러그인 설치 (금융영업 관련 3개)
    log_info "핵심 플러그인 설치 시작..."

    local core_plugins=("sales" "finance" "data")
    for plugin in "${core_plugins[@]}"; do
        log_info "설치 중: ${plugin}@knowledge-work-plugins"
        if claude plugin install "${plugin}@knowledge-work-plugins" 2>/dev/null; then
            log_ok "${plugin} 플러그인 설치 완료"
        else
            log_warn "${plugin} 플러그인 설치 실패 또는 이미 설치됨"
        fi
    done

    echo ""

    # 1-3. 추가 유용 플러그인 설치
    log_info "추가 플러그인 설치 시작..."

    local extra_plugins=("customer-support" "enterprise-search" "productivity")
    for plugin in "${extra_plugins[@]}"; do
        log_info "설치 중: ${plugin}@knowledge-work-plugins"
        if claude plugin install "${plugin}@knowledge-work-plugins" 2>/dev/null; then
            log_ok "${plugin} 플러그인 설치 완료"
        else
            log_warn "${plugin} 플러그인 설치 실패 또는 이미 설치됨"
        fi
    done

    echo ""
    log_ok "Phase 1 완료 - 설치된 플러그인 확인:"
    claude plugin list 2>/dev/null || log_warn "플러그인 목록 조회 실패"
}

# ============================================================
# Phase 2: MCP 서버 설정
# ============================================================
setup_mcp_servers() {
    log_header "Phase 2: 금융 데이터 MCP 서버 설정"

    # 2-1. Alpha Vantage MCP 서버
    setup_alphavantage

    echo ""

    # 2-2. Financial Datasets MCP 서버
    setup_financial_datasets

    echo ""
    log_ok "Phase 2 완료 - MCP 서버 상태 확인:"
    claude mcp list 2>/dev/null || log_warn "MCP 목록 조회 실패"
}

setup_alphavantage() {
    log_info "Alpha Vantage MCP 서버 설정"

    local api_key="${ALPHAVANTAGE_API_KEY:-}"

    if [ -z "$api_key" ]; then
        echo ""
        echo -e "${YELLOW}Alpha Vantage API 키가 필요합니다.${NC}"
        echo "무료 발급: https://www.alphavantage.co/support/#api-key"
        echo "(무료 티어: 500콜/일, 5콜/분)"
        echo ""
        read -rp "Alpha Vantage API Key 입력 (건너뛰려면 Enter): " api_key
    fi

    if [ -z "$api_key" ]; then
        log_warn "Alpha Vantage 건너뜀 - 나중에 다음 명령어로 추가 가능:"
        echo "  claude mcp add --transport http alphavantage \\"
        echo '    "https://mcp.alphavantage.co/mcp?apikey=YOUR_API_KEY"'
        return 0
    fi

    log_info "Alpha Vantage MCP 등록 중..."
    if claude mcp add --transport http alphavantage \
        "https://mcp.alphavantage.co/mcp?apikey=${api_key}" 2>/dev/null; then
        log_ok "Alpha Vantage MCP 서버 등록 완료"
    else
        log_error "Alpha Vantage MCP 등록 실패"
        log_info "수동 등록 명령어:"
        echo "  claude mcp add --transport http alphavantage \\"
        echo "    \"https://mcp.alphavantage.co/mcp?apikey=${api_key}\""
    fi
}

setup_financial_datasets() {
    log_info "Financial Datasets MCP 서버 설정"

    local api_key="${FINANCIAL_DATASETS_API_KEY:-}"

    if [ -z "$api_key" ]; then
        echo ""
        echo -e "${YELLOW}Financial Datasets API 키가 필요합니다.${NC}"
        echo "발급: https://financialdatasets.ai/"
        echo ""
        read -rp "Financial Datasets API Key 입력 (건너뛰려면 Enter): " api_key
    fi

    if [ -z "$api_key" ]; then
        log_warn "Financial Datasets 건너뜀 - 나중에 다음 명령어로 추가 가능:"
        echo "  방법 A (원격): claude mcp add --transport http financial-datasets \\"
        echo '    https://api.financialdatasets.ai/mcp'
        echo ""
        echo "  방법 B (로컬): 아래 로컬 서버 설정 섹션 참조"
        return 0
    fi

    echo ""
    echo "설치 방법을 선택하세요:"
    echo "  1) 원격 서버 (간편 - API 직접 연결)"
    echo "  2) 로컬 서버 (고급 - git clone + Python)"
    echo ""
    read -rp "선택 [1/2, 기본값=1]: " method
    method="${method:-1}"

    if [ "$method" = "2" ]; then
        setup_financial_datasets_local "$api_key"
    else
        setup_financial_datasets_remote "$api_key"
    fi
}

setup_financial_datasets_remote() {
    local api_key="$1"
    log_info "Financial Datasets MCP (원격 서버) 등록 중..."

    if claude mcp add --transport http financial-datasets \
        "https://api.financialdatasets.ai/mcp" 2>/dev/null; then
        log_ok "Financial Datasets MCP 서버 (원격) 등록 완료"
    else
        log_error "Financial Datasets MCP 등록 실패"
        log_info "수동 등록 명령어:"
        echo "  claude mcp add --transport http financial-datasets \\"
        echo '    https://api.financialdatasets.ai/mcp'
    fi
}

setup_financial_datasets_local() {
    local api_key="$1"
    local install_dir="/Users/koscom/@work/cc_plugins/financial-datasets-mcp"

    log_info "Financial Datasets MCP (로컬 서버) 설치 중..."

    # uv 확인
    if ! command -v uv &>/dev/null; then
        log_error "uv가 설치되어 있지 않습니다."
        log_info "설치: curl -LsSf https://astral.sh/uv/install.sh | sh"
        return 1
    fi

    # 리포지토리 클론
    if [ -d "$install_dir" ]; then
        log_info "기존 설치 디렉토리 발견 - 업데이트 중..."
        cd "$install_dir" && git pull
    else
        log_info "리포지토리 클론 중..."
        git clone https://github.com/financial-datasets/mcp-server.git "$install_dir"
    fi

    cd "$install_dir"

    # 가상환경 및 의존성 설치
    log_info "Python 가상환경 설정 및 의존성 설치 중..."
    uv venv
    source .venv/bin/activate
    uv pip install "mcp[cli]" httpx python-dotenv

    # .env 파일 생성
    echo "FINANCIAL_DATASETS_API_KEY=${api_key}" > .env
    log_ok ".env 파일 생성 완료"

    # Claude MCP 등록
    log_info "Claude MCP에 로컬 서버 등록 중..."
    local uv_path
    uv_path="$(which uv)"

    if claude mcp add --transport stdio financial-datasets \
        --env "FINANCIAL_DATASETS_API_KEY=${api_key}" \
        -- "$uv_path" --directory "$install_dir" run server.py 2>/dev/null; then
        log_ok "Financial Datasets MCP 서버 (로컬) 등록 완료"
    else
        log_error "MCP 등록 실패. 수동 등록:"
        echo "  claude mcp add --transport stdio financial-datasets \\"
        echo "    --env FINANCIAL_DATASETS_API_KEY=${api_key} \\"
        echo "    -- ${uv_path} --directory ${install_dir} run server.py"
    fi

    deactivate 2>/dev/null || true
}

# ============================================================
# 검증
# ============================================================
verify_installation() {
    log_header "설치 검증"

    log_info "설치된 플러그인:"
    claude plugin list 2>/dev/null || log_warn "플러그인 목록 조회 실패"

    echo ""
    log_info "MCP 서버 상태:"
    claude mcp list 2>/dev/null || log_warn "MCP 목록 조회 실패"

    echo ""
    log_ok "설치가 완료되었습니다!"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo " 테스트 방법 (Claude Code 내에서)"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo " 1. MCP 상태 확인:  /mcp"
    echo ""
    echo " 2. Alpha Vantage 테스트:"
    echo '    "삼성전자(005930.KS) 주가 조회해줘"'
    echo '    "AAPL의 RSI 지표를 분석해줘"'
    echo ""
    echo " 3. Financial Datasets 테스트:"
    echo '    "Apple의 최근 손익계산서 보여줘"'
    echo '    "Tesla의 대차대조표 분석해줘"'
    echo ""
    echo " 4. Sales 플러그인 테스트:"
    echo '    /call-prep, /forecast, /pipeline-review'
    echo ""
    echo " 5. Finance 플러그인 테스트:"
    echo '    /journal-entry, /reconciliation, /income-statement'
    echo ""
    echo " 6. Data 플러그인 테스트:"
    echo '    /analyze, /write-query, /build-dashboard'
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

# ============================================================
# Main
# ============================================================
main() {
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo " 금융영업부서용 Claude 플러그인 & MCP 서버 설치"
    echo " $(date '+%Y-%m-%d %H:%M:%S')"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    case "$PHASE" in
        1|phase1|plugins)
            install_plugins
            ;;
        2|phase2|mcp)
            setup_mcp_servers
            ;;
        all)
            install_plugins
            setup_mcp_servers
            verify_installation
            ;;
        verify|check)
            verify_installation
            ;;
        *)
            echo "사용법: $0 [1|2|all|verify]"
            echo "  1     - Phase 1: 플러그인만 설치"
            echo "  2     - Phase 2: MCP 서버만 설정"
            echo "  all   - 전체 설치 (기본값)"
            echo "  verify - 설치 검증만"
            exit 1
            ;;
    esac
}

main
