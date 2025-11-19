/**
 * 2024년 소득세 세율표 및 공제 기준
 */

/**
 * 종합소득세 과세표준 구간별 세율 (2024년 기준)
 */
export const TAX_BRACKETS = [
  { min: 0, max: 14_000_000, rate: 0.06, deduction: 0 },
  { min: 14_000_001, max: 50_000_000, rate: 0.15, deduction: 1_260_000 },
  { min: 50_000_001, max: 88_000_000, rate: 0.24, deduction: 5_760_000 },
  { min: 88_000_001, max: 150_000_000, rate: 0.35, deduction: 15_440_000 },
  { min: 150_000_001, max: 300_000_000, rate: 0.38, deduction: 19_940_000 },
  { min: 300_000_001, max: 500_000_000, rate: 0.40, deduction: 25_940_000 },
  { min: 500_000_001, max: 1_000_000_000, rate: 0.42, deduction: 35_940_000 },
  { min: 1_000_000_001, max: Infinity, rate: 0.45, deduction: 65_940_000 },
] as const;

/**
 * 근로소득공제 (총 급여액에 따른 공제액 계산)
 */
export function calculateEarnedIncomeDeduction(totalSalary: number): number {
  if (totalSalary <= 5_000_000) {
    return totalSalary * 0.7;
  } else if (totalSalary <= 15_000_000) {
    return 3_500_000 + (totalSalary - 5_000_000) * 0.4;
  } else if (totalSalary <= 45_000_000) {
    return 7_500_000 + (totalSalary - 15_000_000) * 0.15;
  } else if (totalSalary <= 100_000_000) {
    return 12_000_000 + (totalSalary - 45_000_000) * 0.05;
  } else {
    return 14_750_000 + (totalSalary - 100_000_000) * 0.02;
  }
}

/**
 * 과세표준에 따른 세액 계산
 */
export function calculateTaxByBracket(taxBase: number): number {
  if (taxBase <= 0) return 0;

  for (const bracket of TAX_BRACKETS) {
    if (taxBase >= bracket.min && taxBase <= bracket.max) {
      return taxBase * bracket.rate - bracket.deduction;
    }
  }

  return 0;
}

/**
 * 인적공제 기준
 */
export const PERSONAL_DEDUCTION = {
  /** 기본공제 (본인, 배우자, 부양가족 1인당) */
  BASIC: 1_500_000,
  /** 추가공제 - 경로우대 (70세 이상) */
  SENIOR: 1_000_000,
  /** 추가공제 - 장애인 */
  DISABLED: 2_000_000,
  /** 추가공제 - 부녀자 */
  WOMAN: 500_000,
  /** 추가공제 - 한부모 */
  SINGLE_PARENT: 1_000_000,
} as const;

/**
 * 신용카드 등 사용금액 소득공제
 */
export const CARD_DEDUCTION = {
  /** 최소 사용액 비율 (총급여의 25%) */
  MIN_USAGE_RATE: 0.25,
  /** 신용카드 공제율 */
  CREDIT_CARD_RATE: 0.15,
  /** 체크카드/현금영수증 공제율 */
  DEBIT_CARD_RATE: 0.3,
  /** 전통시장 공제율 */
  TRADITIONAL_MARKET_RATE: 0.4,
  /** 대중교통 공제율 */
  PUBLIC_TRANSPORT_RATE: 0.4,
  /** 공제 한도 (총급여 기준) */
  LIMIT: {
    UNDER_70M: 3_000_000, // 7천만원 이하
    UNDER_120M: 2_500_000, // 1억2천만원 이하
    OVER_120M: 2_000_000, // 1억2천만원 초과
  },
  /** 전통시장, 대중교통 추가 한도 */
  ADDITIONAL_LIMIT: 3_000_000,
} as const;

/**
 * 특별세액공제 한도
 */
export const TAX_CREDIT_LIMIT = {
  /** 연금저축 세액공제 한도 */
  PENSION_SAVINGS: 6_000_000,
  /** 연금저축 세액공제율 (총급여 5천5백만원 이하) */
  PENSION_RATE_HIGH: 0.15,
  /** 연금저축 세액공제율 (총급여 5천5백만원 초과) */
  PENSION_RATE_LOW: 0.12,
  /** 표준세액공제 (특별세액공제 미적용시) */
  STANDARD_TAX_CREDIT: 130_000,
} as const;

/**
 * 의료비 공제
 */
export const MEDICAL_DEDUCTION = {
  /** 최소 지출액 비율 (총급여의 3%) */
  MIN_EXPENSE_RATE: 0.03,
  /** 공제율 */
  RATE: 0.15,
  /** 공제 한도 (없음 - 전액 공제) */
  NO_LIMIT: true,
} as const;

/**
 * 교육비 공제
 */
export const EDUCATION_DEDUCTION = {
  /** 본인 공제 한도 (없음) */
  SELF_NO_LIMIT: true,
  /** 취학전 아동 1인당 한도 */
  PRESCHOOL_LIMIT: 3_000_000,
  /** 초중고생 1인당 한도 */
  SCHOOL_LIMIT: 3_000_000,
  /** 대학생 1인당 한도 */
  UNIVERSITY_LIMIT: 9_000_000,
  /** 공제율 */
  RATE: 0.15,
} as const;

/**
 * 기부금 공제
 */
export const DONATION_DEDUCTION = {
  /** 법정기부금 한도 (소득금액의 100%) */
  LEGAL_LIMIT_RATE: 1.0,
  /** 지정기부금 한도 (소득금액의 30%) */
  DESIGNATED_LIMIT_RATE: 0.3,
  /** 공제율 */
  RATE: 0.15,
  /** 고액 기부금 공제율 (1천만원 초과분) */
  HIGH_AMOUNT_RATE: 0.3,
  HIGH_AMOUNT_THRESHOLD: 10_000_000,
} as const;

/**
 * 주택자금 공제
 */
export const HOUSING_DEDUCTION = {
  /** 주택임차차입금 원리금상환액 공제율 */
  RENTAL_LOAN_RATE: 0.4,
  /** 주택임차차입금 한도 */
  RENTAL_LOAN_LIMIT: 4_000_000,
  /** 장기주택저당차입금 이자상환액 공제율 */
  MORTGAGE_RATE: 0.3,
} as const;
