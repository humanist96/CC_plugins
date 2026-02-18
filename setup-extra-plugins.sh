#!/bin/bash
# ============================================================
# 추가 유용 플러그인 설치 스크립트
# knowledge-work-plugins 마켓플레이스의 나머지 플러그인 +
# claude-plugins-official 마켓플레이스의 영업 관련 플러그인
# ============================================================

set -euo pipefail

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " 추가 플러그인 설치"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# knowledge-work-plugins 추가 플러그인
echo -e "${BLUE}[knowledge-work-plugins 추가 플러그인]${NC}"
echo ""

EXTRA_KW_PLUGINS=(
    "marketing"            # 마케팅 콘텐츠, 캠페인 관리
    "product-management"   # 제품 관리, PRD 작성
    "legal"                # 계약 검토, 법률 문서
)

for plugin in "${EXTRA_KW_PLUGINS[@]}"; do
    echo -e "${BLUE}설치 중:${NC} ${plugin}@knowledge-work-plugins"
    if claude plugin install "${plugin}@knowledge-work-plugins" 2>/dev/null; then
        echo -e "${GREEN}[OK]${NC} ${plugin} 설치 완료"
    else
        echo -e "${YELLOW}[WARN]${NC} ${plugin} 설치 실패 또는 이미 설치됨"
    fi
done

echo ""

# claude-plugins-official 유용 플러그인
echo -e "${BLUE}[claude-plugins-official 추가 플러그인]${NC}"
echo ""

OFFICIAL_PLUGINS=(
    "code-review"          # 코드 리뷰
    "security-guidance"    # 보안 가이드
    "frontend-design"      # 프론트엔드 디자인
)

for plugin in "${OFFICIAL_PLUGINS[@]}"; do
    echo -e "${BLUE}설치 중:${NC} ${plugin}@claude-plugins-official"
    if claude plugin install "${plugin}@claude-plugins-official" 2>/dev/null; then
        echo -e "${GREEN}[OK]${NC} ${plugin} 설치 완료"
    else
        echo -e "${YELLOW}[WARN]${NC} ${plugin} 설치 실패 또는 이미 설치됨"
    fi
done

echo ""

# 외부 플러그인 (claude-plugins-official/external_plugins)
echo -e "${BLUE}[외부 연동 플러그인 (선택)]${NC}"
echo ""
echo "다음 외부 플러그인은 필요에 따라 개별 설치하세요:"
echo ""
echo "  # Slack 연동"
echo "  claude plugin install slack@claude-plugins-official"
echo ""
echo "  # GitHub 연동"
echo "  claude plugin install github@claude-plugins-official"
echo ""
echo "  # Linear 프로젝트 관리"
echo "  claude plugin install linear@claude-plugins-official"
echo ""
echo "  # Asana 프로젝트 관리"
echo "  claude plugin install asana@claude-plugins-official"
echo ""
echo "  # Stripe 결제"
echo "  claude plugin install stripe@claude-plugins-official"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " 설치 완료!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
claude plugin list 2>/dev/null || echo "플러그인 목록 조회 실패"
