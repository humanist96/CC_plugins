/** 인기 한국 상장기업 정적 매핑 (즉시 검색용) */

import type { DartCorpCode } from "@/types/dart"

/** corp_code → 기업 정보 매핑 */
export const POPULAR_CORP_CODES: readonly DartCorpCode[] = [
  // 시가총액 상위 (유가증권)
  { corp_code: "00126380", corp_name: "삼성전자", stock_code: "005930", modify_date: "20240101" },
  { corp_code: "00164779", corp_name: "SK하이닉스", stock_code: "000660", modify_date: "20240101" },
  { corp_code: "00104752", corp_name: "LG에너지솔루션", stock_code: "373220", modify_date: "20240101" },
  { corp_code: "00164742", corp_name: "삼성바이오로직스", stock_code: "207940", modify_date: "20240101" },
  { corp_code: "00401731", corp_name: "현대자동차", stock_code: "005380", modify_date: "20240101" },
  { corp_code: "00129460", corp_name: "기아", stock_code: "000270", modify_date: "20240101" },
  { corp_code: "00159344", corp_name: "셀트리온", stock_code: "068270", modify_date: "20240101" },
  { corp_code: "00104299", corp_name: "KB금융", stock_code: "105560", modify_date: "20240101" },
  { corp_code: "00107367", corp_name: "신한지주", stock_code: "055550", modify_date: "20240101" },
  { corp_code: "00126186", corp_name: "POSCO홀딩스", stock_code: "005490", modify_date: "20240101" },
  { corp_code: "00593721", corp_name: "하나금융지주", stock_code: "086790", modify_date: "20240101" },
  { corp_code: "00126274", corp_name: "삼성SDI", stock_code: "006400", modify_date: "20240101" },
  { corp_code: "00194900", corp_name: "LG화학", stock_code: "051910", modify_date: "20240101" },
  { corp_code: "00126357", corp_name: "삼성물산", stock_code: "028260", modify_date: "20240101" },
  { corp_code: "00401004", corp_name: "현대모비스", stock_code: "012330", modify_date: "20240101" },
  { corp_code: "00105228", corp_name: "SK이노베이션", stock_code: "096770", modify_date: "20240101" },
  { corp_code: "00100601", corp_name: "NAVER", stock_code: "035420", modify_date: "20240101" },
  { corp_code: "00154316", corp_name: "카카오", stock_code: "035720", modify_date: "20240101" },
  { corp_code: "00138250", corp_name: "LG전자", stock_code: "066570", modify_date: "20240101" },
  { corp_code: "00126295", corp_name: "삼성전기", stock_code: "009150", modify_date: "20240101" },
  { corp_code: "00155607", corp_name: "SK텔레콤", stock_code: "017670", modify_date: "20240101" },
  { corp_code: "00105721", corp_name: "KT", stock_code: "030200", modify_date: "20240101" },
  { corp_code: "00113718", corp_name: "LG", stock_code: "003550", modify_date: "20240101" },
  { corp_code: "00156619", corp_name: "SK", stock_code: "034730", modify_date: "20240101" },
  { corp_code: "00164529", corp_name: "한국전력공사", stock_code: "015760", modify_date: "20240101" },
  { corp_code: "00219323", corp_name: "삼성생명", stock_code: "032830", modify_date: "20240101" },
  { corp_code: "00109810", corp_name: "한화에어로스페이스", stock_code: "012450", modify_date: "20240101" },
  { corp_code: "00146964", corp_name: "우리금융지주", stock_code: "316140", modify_date: "20240101" },
  { corp_code: "00126302", corp_name: "삼성화재", stock_code: "000810", modify_date: "20240101" },
  { corp_code: "00404579", corp_name: "HD현대중공업", stock_code: "329180", modify_date: "20240101" },

  // 코스닥 주요 기업
  { corp_code: "00413046", corp_name: "에코프로비엠", stock_code: "247540", modify_date: "20240101" },
  { corp_code: "00783977", corp_name: "에코프로", stock_code: "086520", modify_date: "20240101" },
  { corp_code: "00498025", corp_name: "알테오젠", stock_code: "196170", modify_date: "20240101" },
  { corp_code: "00327142", corp_name: "엘앤에프", stock_code: "066970", modify_date: "20240101" },
  { corp_code: "00694578", corp_name: "HLB", stock_code: "028300", modify_date: "20240101" },
  { corp_code: "00124715", corp_name: "JYP Ent.", stock_code: "035900", modify_date: "20240101" },
  { corp_code: "00568622", corp_name: "카카오게임즈", stock_code: "293490", modify_date: "20240101" },
  { corp_code: "00144437", corp_name: "CJ ENM", stock_code: "035760", modify_date: "20240101" },
  { corp_code: "00120021", corp_name: "펄어비스", stock_code: "263750", modify_date: "20240101" },
  { corp_code: "00738001", corp_name: "크래프톤", stock_code: "259960", modify_date: "20240101" },
] as const

/** 기업 별칭 → corp_name 매핑 (자연어 검색용) */
export const CORP_ALIASES: Readonly<Record<string, string>> = {
  // 삼성 계열
  "삼전": "삼성전자",
  "삼성": "삼성전자",
  "삼바": "삼성바이오로직스",
  "삼성바이오": "삼성바이오로직스",
  "삼성SDI": "삼성SDI",
  "삼성SDS": "삼성SDS",

  // SK 계열
  "하닉": "SK하이닉스",
  "하이닉스": "SK하이닉스",
  "SK하닉": "SK하이닉스",
  "SKT": "SK텔레콤",

  // 현대/기아
  "현차": "현대자동차",
  "현대차": "현대자동차",
  "현자": "현대자동차",

  // IT/플랫폼
  "네이버": "NAVER",
  "네버": "NAVER",

  // 에너지/배터리
  "엘지화학": "LG화학",
  "엘지엔솔": "LG에너지솔루션",
  "LG엔솔": "LG에너지솔루션",
  "LGENSOL": "LG에너지솔루션",
  "엘지전자": "LG전자",
  "포스코": "POSCO홀딩스",
  "포스코홀딩스": "POSCO홀딩스",

  // 바이오
  "셀트리온": "셀트리온",
  "셀트": "셀트리온",

  // 금융
  "KB": "KB금융",
  "국민은행": "KB금융",
  "신한": "신한지주",
  "신한은행": "신한지주",
  "하나": "하나금융지주",
  "하나은행": "하나금융지주",
  "우리": "우리금융지주",
  "우리은행": "우리금융지주",
  "한전": "한국전력공사",

  // 코스닥
  "에코프로BM": "에코프로비엠",
  "크래프톤": "크래프톤",
  "펄어비스": "펄어비스",
} as const
