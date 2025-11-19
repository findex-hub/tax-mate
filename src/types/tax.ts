/**
 * 연말정산 관련 타입 정의
 */

/**
 * 소득 정보
 */
export interface IncomeInfo {
  /** 총 급여액 (세전) */
  totalSalary: number;
  /** 근무 개월 수 */
  workMonths: number;
}

/**
 * 공제 항목
 */
export interface DeductionItems {
  /** 신용카드 사용액 */
  creditCard: number;
  /** 체크카드/현금영수증 사용액 */
  debitCard: number;
  /** 전통시장 사용액 */
  traditionalMarket: number;
  /** 대중교통 사용액 */
  publicTransport: number;
  /** 의료비 */
  medical: number;
  /** 교육비 */
  education: number;
  /** 기부금 */
  donation: number;
  /** 주택자금 (주택임차차입금 원리금상환액) */
  housingFund: number;
  /** 연금저축 */
  pensionSavings: number;
  /** 개인연금저축 (2000.12.31 이전 가입) */
  personalPension: number;
}

/**
 * 부양가족 정보
 */
export interface DependentInfo {
  /** 배우자 유무 */
  hasSpouse: boolean;
  /** 자녀 수 (20세 이하) */
  numberOfChildren: number;
  /** 기타 부양가족 수 (직계존속 등) */
  numberOfOtherDependents: number;
}

/**
 * 세액 계산 결과
 */
export interface TaxCalculationResult {
  /** 총 급여액 */
  totalSalary: number;
  /** 근로소득공제 */
  earnedIncomeDeduction: number;
  /** 근로소득금액 */
  earnedIncome: number;
  /** 인적공제 (기본공제 + 추가공제) */
  personalDeduction: number;
  /** 특별소득공제 (건강보험료 등) */
  specialDeduction: number;
  /** 그 외 소득공제 */
  otherDeductions: number;
  /** 총 소득공제 */
  totalDeductions: number;
  /** 과세표준 */
  taxBase: number;
  /** 산출세액 */
  calculatedTax: number;
  /** 세액공제 */
  taxCredit: number;
  /** 결정세액 */
  finalTax: number;
  /** 기납부세액 (간이세액) */
  prepaidTax: number;
  /** 환급세액 (양수) / 추가납부세액 (음수) */
  refundAmount: number;
}

/**
 * 공제 항목별 상세 정보
 */
export interface DeductionDetail {
  /** 공제 항목명 */
  name: string;
  /** 공제 대상 금액 */
  amount: number;
  /** 공제율 */
  rate: number;
  /** 공제 금액 */
  deduction: number;
  /** 설명 */
  description?: string;
}

/**
 * 절세 추천 항목
 */
export interface TaxSavingRecommendation {
  /** 추천 항목 */
  category: string;
  /** 현재 금액 */
  currentAmount: number;
  /** 추천 금액 */
  recommendedAmount: number;
  /** 예상 절세액 */
  expectedSaving: number;
  /** 설명 */
  description: string;
  /** 우선순위 (1-5, 낮을수록 높은 우선순위) */
  priority: number;
}

/**
 * 컨설팅 결과
 */
export interface ConsultingResult {
  /** 세액 계산 결과 */
  taxResult: TaxCalculationResult;
  /** 공제 항목별 상세 */
  deductionDetails: DeductionDetail[];
  /** 절세 추천 사항 */
  recommendations: TaxSavingRecommendation[];
  /** 총 절세 가능 금액 */
  totalPotentialSaving: number;
}

/**
 * 전체 입력 데이터
 */
export interface TaxFormData {
  income: IncomeInfo;
  deductions: DeductionItems;
  dependents: DependentInfo;
}
