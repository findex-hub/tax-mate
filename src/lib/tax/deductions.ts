/**
 * 각종 소득공제 계산 로직
 */

import type { DeductionItems, DependentInfo, DeductionDetail } from '@/types/tax';
import {
  PERSONAL_DEDUCTION,
  CARD_DEDUCTION,
  MEDICAL_DEDUCTION,
  EDUCATION_DEDUCTION,
  DONATION_DEDUCTION,
  HOUSING_DEDUCTION,
  TAX_CREDIT_LIMIT,
} from './tax-rates';

/**
 * 인적공제 계산
 */
export function calculatePersonalDeduction(dependents: DependentInfo): number {
  let total = PERSONAL_DEDUCTION.BASIC; // 본인 기본공제

  // 배우자 공제
  if (dependents.hasSpouse) {
    total += PERSONAL_DEDUCTION.BASIC;
  }

  // 자녀 공제
  total += dependents.numberOfChildren * PERSONAL_DEDUCTION.BASIC;

  // 기타 부양가족 공제
  total += dependents.numberOfOtherDependents * PERSONAL_DEDUCTION.BASIC;

  return total;
}

/**
 * 신용카드 등 사용금액 소득공제 계산
 */
export function calculateCardDeduction(
  totalSalary: number,
  deductions: Pick<
    DeductionItems,
    'creditCard' | 'debitCard' | 'traditionalMarket' | 'publicTransport'
  >
): { amount: number; details: DeductionDetail[] } {
  const minUsage = totalSalary * CARD_DEDUCTION.MIN_USAGE_RATE;
  const totalUsage =
    deductions.creditCard +
    deductions.debitCard +
    deductions.traditionalMarket +
    deductions.publicTransport;

  // 최소 사용액 미만인 경우 공제 없음
  if (totalUsage <= minUsage) {
    return { amount: 0, details: [] };
  }

  const excessAmount = totalUsage - minUsage;

  // 신용카드 공제액 계산
  const creditCardExcess = Math.max(0, deductions.creditCard - minUsage);
  const creditCardDeduction = Math.min(
    creditCardExcess,
    excessAmount
  ) * CARD_DEDUCTION.CREDIT_CARD_RATE;

  // 체크카드/현금영수증 공제액 계산
  const debitCardDeduction =
    deductions.debitCard * CARD_DEDUCTION.DEBIT_CARD_RATE;

  // 전통시장 공제액 계산
  const traditionalMarketDeduction =
    deductions.traditionalMarket * CARD_DEDUCTION.TRADITIONAL_MARKET_RATE;

  // 대중교통 공제액 계산
  const publicTransportDeduction =
    deductions.publicTransport * CARD_DEDUCTION.PUBLIC_TRANSPORT_RATE;

  let totalDeduction =
    creditCardDeduction +
    debitCardDeduction +
    traditionalMarketDeduction +
    publicTransportDeduction;

  // 한도 적용
  let limit: number = CARD_DEDUCTION.LIMIT.UNDER_70M;
  if (totalSalary > 120_000_000) {
    limit = CARD_DEDUCTION.LIMIT.OVER_120M;
  } else if (totalSalary > 70_000_000) {
    limit = CARD_DEDUCTION.LIMIT.UNDER_120M;
  }

  // 전통시장, 대중교통 추가 한도
  const additionalDeduction =
    traditionalMarketDeduction + publicTransportDeduction;
  const additionalLimit = Math.min(
    additionalDeduction,
    CARD_DEDUCTION.ADDITIONAL_LIMIT
  );

  const basicLimit = Math.min(
    creditCardDeduction + debitCardDeduction,
    limit
  );

  totalDeduction = basicLimit + additionalLimit;

  const details: DeductionDetail[] = [
    {
      name: '신용카드',
      amount: deductions.creditCard,
      rate: CARD_DEDUCTION.CREDIT_CARD_RATE,
      deduction: creditCardDeduction,
      description: `최소사용액(${Math.round(minUsage).toLocaleString()}원) 초과분의 15%`,
    },
    {
      name: '체크카드/현금영수증',
      amount: deductions.debitCard,
      rate: CARD_DEDUCTION.DEBIT_CARD_RATE,
      deduction: debitCardDeduction,
      description: '사용액의 30%',
    },
    {
      name: '전통시장',
      amount: deductions.traditionalMarket,
      rate: CARD_DEDUCTION.TRADITIONAL_MARKET_RATE,
      deduction: traditionalMarketDeduction,
      description: '사용액의 40% (추가한도 300만원)',
    },
    {
      name: '대중교통',
      amount: deductions.publicTransport,
      rate: CARD_DEDUCTION.PUBLIC_TRANSPORT_RATE,
      deduction: publicTransportDeduction,
      description: '사용액의 40% (추가한도 300만원)',
    },
  ];

  return { amount: totalDeduction, details };
}

/**
 * 의료비 공제 계산
 */
export function calculateMedicalDeduction(
  totalSalary: number,
  medicalExpense: number
): { amount: number; detail: DeductionDetail } {
  const minExpense = totalSalary * MEDICAL_DEDUCTION.MIN_EXPENSE_RATE;
  const excessAmount = Math.max(0, medicalExpense - minExpense);
  const deduction = excessAmount * MEDICAL_DEDUCTION.RATE;

  return {
    amount: deduction,
    detail: {
      name: '의료비',
      amount: medicalExpense,
      rate: MEDICAL_DEDUCTION.RATE,
      deduction,
      description: `총급여의 3%(${Math.round(minExpense).toLocaleString()}원) 초과분의 15%`,
    },
  };
}

/**
 * 교육비 공제 계산
 */
export function calculateEducationDeduction(
  educationExpense: number
): { amount: number; detail: DeductionDetail } {
  // 간단한 계산 (본인 교육비로 가정)
  const deduction = educationExpense * EDUCATION_DEDUCTION.RATE;

  return {
    amount: deduction,
    detail: {
      name: '교육비',
      amount: educationExpense,
      rate: EDUCATION_DEDUCTION.RATE,
      deduction,
      description: '본인 교육비의 15% (전액 공제)',
    },
  };
}

/**
 * 기부금 공제 계산
 */
export function calculateDonationDeduction(
  earnedIncome: number,
  donation: number
): { amount: number; detail: DeductionDetail } {
  // 소득금액의 30% 한도
  const limit = earnedIncome * DONATION_DEDUCTION.DESIGNATED_LIMIT_RATE;
  const deductibleAmount = Math.min(donation, limit);

  let deduction = 0;
  if (deductibleAmount <= DONATION_DEDUCTION.HIGH_AMOUNT_THRESHOLD) {
    deduction = deductibleAmount * DONATION_DEDUCTION.RATE;
  } else {
    deduction =
      DONATION_DEDUCTION.HIGH_AMOUNT_THRESHOLD * DONATION_DEDUCTION.RATE +
      (deductibleAmount - DONATION_DEDUCTION.HIGH_AMOUNT_THRESHOLD) *
        DONATION_DEDUCTION.HIGH_AMOUNT_RATE;
  }

  return {
    amount: deduction,
    detail: {
      name: '기부금',
      amount: donation,
      rate: DONATION_DEDUCTION.RATE,
      deduction,
      description: `소득금액의 30% 한도, 1천만원 이하 15%, 초과분 30%`,
    },
  };
}

/**
 * 주택자금 공제 계산
 */
export function calculateHousingDeduction(
  housingFund: number
): { amount: number; detail: DeductionDetail } {
  const deduction = Math.min(
    housingFund * HOUSING_DEDUCTION.RENTAL_LOAN_RATE,
    HOUSING_DEDUCTION.RENTAL_LOAN_LIMIT
  );

  return {
    amount: deduction,
    detail: {
      name: '주택자금',
      amount: housingFund,
      rate: HOUSING_DEDUCTION.RENTAL_LOAN_RATE,
      deduction,
      description: '주택임차차입금 원리금상환액의 40% (한도 400만원)',
    },
  };
}

/**
 * 연금저축 세액공제 계산
 */
export function calculatePensionTaxCredit(
  totalSalary: number,
  pensionSavings: number
): { amount: number; detail: DeductionDetail } {
  const limit = TAX_CREDIT_LIMIT.PENSION_SAVINGS;
  const deductibleAmount = Math.min(pensionSavings, limit);

  const rate =
    totalSalary <= 55_000_000
      ? TAX_CREDIT_LIMIT.PENSION_RATE_HIGH
      : TAX_CREDIT_LIMIT.PENSION_RATE_LOW;

  const credit = deductibleAmount * rate;

  return {
    amount: credit,
    detail: {
      name: '연금저축',
      amount: pensionSavings,
      rate,
      deduction: credit,
      description: `납입액의 ${rate * 100}% 세액공제 (한도 ${(limit / 10000).toFixed(0)}만원)`,
    },
  };
}

/**
 * 표준세액공제 적용 여부 판단
 */
export function shouldApplyStandardTaxCredit(
  totalSpecialDeduction: number
): boolean {
  return totalSpecialDeduction < TAX_CREDIT_LIMIT.STANDARD_TAX_CREDIT;
}
