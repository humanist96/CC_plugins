/** DART (전자공시시스템) OpenAPI response types */

/** DART API 공통 응답 래퍼 */
export interface DartApiResponse<T> {
  readonly status: string
  readonly message: string
  readonly list?: readonly T[]
}

/** 기업코드 (corpCode.xml에서 추출) */
export interface DartCorpCode {
  readonly corp_code: string    // 8자리 기업코드
  readonly corp_name: string    // 기업명
  readonly stock_code: string   // 6자리 종목코드 (상장사만)
  readonly modify_date: string  // 최종변경일
}

/** 기업개황 */
export interface DartCompanyOverview {
  readonly status: string
  readonly message: string
  readonly corp_code: string
  readonly corp_name: string
  readonly corp_name_eng: string
  readonly stock_name: string
  readonly stock_code: string
  readonly ceo_nm: string
  readonly corp_cls: string     // Y: 유가증권, K: 코스닥, N: 코넥스, E: 기타
  readonly jurir_no: string
  readonly bizr_no: string
  readonly adres: string
  readonly hm_url: string
  readonly ir_url: string
  readonly phn_no: string
  readonly fax_no: string
  readonly induty_code: string
  readonly est_dt: string       // 설립일 (YYYYMMDD)
  readonly acc_mt: string       // 결산월
}

/** 공시 항목 */
export interface DartDisclosure {
  readonly corp_code: string
  readonly corp_name: string
  readonly stock_code: string
  readonly corp_cls: string
  readonly report_nm: string    // 보고서명
  readonly rcept_no: string     // 접수번호
  readonly flr_nm: string       // 공시제출인명
  readonly rcept_dt: string     // 접수일자 (YYYYMMDD)
  readonly rm: string           // 비고
}

/** 재무제표 전체 항목 */
export interface DartFinancialItem {
  readonly rcept_no: string
  readonly reprt_code: string
  readonly bsns_year: string
  readonly corp_code: string
  readonly sj_div: string       // BS: 재무상태표, IS: 손익계산서, CIS: 포괄손익, CF: 현금흐름, SCE: 자본변동
  readonly sj_nm: string
  readonly account_id: string
  readonly account_nm: string   // 계정명
  readonly account_detail: string
  readonly thstrm_nm: string    // 당기명 (예: "제 56 기")
  readonly thstrm_amount: string // 당기금액
  readonly frmtrm_nm: string    // 전기명
  readonly frmtrm_amount: string // 전기금액
  readonly bfefrmtrm_nm: string // 전전기명
  readonly bfefrmtrm_amount: string // 전전기금액
  readonly ord: string          // 계정 순서
  readonly currency: string
}

/** 주요 계정 (매출, 영업이익, 순이익, 자산총계) */
export interface DartKeyAccount {
  readonly label: string
  readonly thstrm: number | null     // 당기
  readonly frmtrm: number | null     // 전기
  readonly bfefrmtrm: number | null  // 전전기
  readonly yoyChange: number | null  // YoY 변화율 (%)
}

/** 재무제표 요청 파라미터 */
export interface DartFinancialParams {
  readonly corp_code: string
  readonly bsns_year: string     // 사업연도 (YYYY)
  readonly reprt_code: string    // 11013: 1분기, 11012: 반기, 11014: 3분기, 11011: 사업보고서
  readonly fs_div: string        // OFS: 개별, CFS: 연결
}

/** 공시 검색 파라미터 */
export interface DartDisclosureParams {
  readonly corp_code: string
  readonly bgn_de?: string       // 시작일 (YYYYMMDD)
  readonly end_de?: string       // 종료일 (YYYYMMDD)
  readonly last_reprt_at?: string // 최종보고서 여부 (Y/N)
  readonly pblntf_ty?: string    // 공시유형 (A: 정기, B: 주요사항 등)
  readonly page_no?: string
  readonly page_count?: string
}

/** 재무제표 테이블 행 데이터 */
export interface FinancialTableRow {
  readonly accountName: string
  readonly thstrm: string         // 당기금액 (포맷팅된 문자열)
  readonly frmtrm: string         // 전기금액
  readonly bfefrmtrm: string      // 전전기금액
  readonly thstrmRaw: number | null
  readonly frmtrmRaw: number | null
  readonly bfefrmtrmRaw: number | null
}

/** 재무제표 테이블 데이터 (sj_div별 그룹) */
export interface FinancialTableData {
  readonly sjDiv: string
  readonly sjName: string
  readonly rows: readonly FinancialTableRow[]
  readonly thstrmName: string
  readonly frmtrmName: string
  readonly bfefrmtrmName: string
}

/** 기업 검색 결과 */
export interface DartSearchResult {
  readonly corp_code: string
  readonly corp_name: string
  readonly stock_code: string
}
