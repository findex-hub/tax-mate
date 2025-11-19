/**
 * 연말정산 세액 계산기
 */

import type {
  TaxFormData,
  TaxCalculationResult,
  DeductionDetail,
  ConsultingResult,
} from '@/types/tax';
import {
  calculateEarnedIncomeDeduction,
  calculateTaxByBracket,
  TAX_CREDIT_LIMIT,
} from './tax-rates';
import {
  calculatePersonalDeduction,
  calculateCardDeduction,
  calculateMedicalDeduction,
  calculateEducationDeduction,
  calculateDonationDeduction,
  calculateHousingDeduction,
  calculatePensionTaxCredit,
  shouldApplyStandardTaxCredit,
} from './deductions';
import { generateRecommendations } from './recommendations';

/**
 * 연말정산 세액 계산 메인 함수
 */
export function calculateYearEndTax(data: TaxFormData): ConsultingResult {
  const { income, deductions, dependents } = data;

  // 1. 총 급여액
  const totalSalary = income.totalSalary;

  // 2. 근로소득공제
  const earnedIncomeDeduction = calculateEarnedIncomeDeduction(totalSalary);

  // 3. 근로소득금액
  const earnedIncome = totalSalary - earnedIncomeDeduction;

  // 4. 인적공제
  const personalDeduction = calculatePersonalDeduction(dependents);

  // 5. 신용카드 등 사용금액 소득공제
  const cardDeductionResult = calculateCardDeduction(totalSalary, {
    creditCard: deductions.creditCard,
    debitCard: deductions.debitCard,
    traditionalMarket: deductions.traditionalMarket,
    publicTransport: deductions.publicTransport,
  });

  // 6. 의료비 공제
  const medicalDeductionResult = calculateMedicalDeduction(
    totalSalary,
    deductions.medical
  );

  // 7. 교육비 공제
  const educationDeductionResult = calculateEducationDeduction(
    deductions.education
  );

  // 8. 기부금 공제
  const donationDeductionResult = calculateDonationDeduction(
    earnedIncome,
    deductions.donation
  );

  // 9. 주택자금 공제
  const housingDeductionResult = calculateHousingDeduction(
    deductions.housingFund
  );

  // 10. 특별소득공제 (건강보험료, 고용보험료 등 - 간단히 총급여의 5%로 가정)
  const specialDeduction = totalSalary * 0.05;

  // 11. 그 외 소득공제 합계
  const otherDeductions =
    cardDeductionResult.amount +
    medicalDeductionResult.amount +
    educationDeductionResult.amount +
    donationDeductionResult.amount +
    housingDeductionResult.amount;

  // 12. 총 소득공제
  const totalDeductions =
    personalDeduction + specialDeduction + otherDeductions;

  // 13. 과세표준
  const taxBase = Math.max(0, earnedIncome - totalDeductions);

  // 14. 산출세액
  const calculatedTax = calculateTaxByBracket(taxBase);

  // 15. 연금저축 세액공제
  const pensionTaxCreditResult = calculatePensionTaxCredit(
    totalSalary,
    deductions.pensionSavings
  );

  // 16. 총 세액공제
  let taxCredit = pensionTaxCreditResult.amount;

  // 표준세액공제 적용 여부 체크
  if (shouldApplyStandardTaxCredit(taxCredit)) {
    taxCredit = TAX_CREDIT_LIMIT.STANDARD_TAX_CREDIT;
  }

  // 17. 결정세액
  const finalTax = Math.max(0, calculatedTax - taxCredit);

  // 18. 기납부세액 (간이세액표 기준 - 간단히 총급여의 3.5%로 가정)
  const prepaidTax = totalSalary * 0.035;

  // 19. 환급세액 또는 추가납부세액
  const refundAmount = prepaidTax - finalTax;

  // 세액 계산 결과
  const taxResult: TaxCalculationResult = {
    totalSalary,
    earnedIncomeDeduction,
    earnedIncome,
    personalDeduction,
    specialDeduction,
    otherDeductions,
    totalDeductions,
    taxBase,
    calculatedTax,
    taxCredit,
    finalTax,
    prepaidTax,
    refundAmount,
  };

  // 공제 항목별 상세
  const deductionDetails: DeductionDetail[] = [
    ...cardDeductionResult.details,
    medicalDeductionResult.detail,
    educationDeductionResult.detail,
    donationDeductionResult.detail,
    housingDeductionResult.detail,
    pensionTaxCreditResult.detail,
  ];

  // 절세 추천 생성
  const recommendations = generateRecommendations(data, taxResult);

  // 총 절세 가능 금액 계산
  const totalPotentialSaving = recommendations.reduce(
    (sum, rec) => sum + rec.expectedSaving,
    0
  );

  return {
    taxResult,
    deductionDetails,
    recommendations,
    totalPotentialSaving,
  };
}

/**
 * 간단한 세액 추정 (빠른 계산용)
 */
export function estimateTax(totalSalary: number): number {
  const earnedIncomeDeduction = calculateEarnedIncomeDeduction(totalSalary);
  const earnedIncome = totalSalary - earnedIncomeDeduction;

  // 기본공제만 적용 (본인)
  const basicDeduction = 1_500_000;
  const taxBase = Math.max(0, earnedIncome - basicDeduction);

  const calculatedTax = calculateTaxByBracket(taxBase);

  // 표준세액공제
  const finalTax = Math.max(
    0,
    calculatedTax - TAX_CREDIT_LIMIT.STANDARD_TAX_CREDIT
  );

  return finalTax;
}
