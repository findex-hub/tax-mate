/**
 * 절세 추천 로직
 */

import type {
  TaxFormData,
  TaxCalculationResult,
  TaxSavingRecommendation,
} from '@/types/tax';
import { CARD_DEDUCTION, TAX_CREDIT_LIMIT } from './tax-rates';

/**
 * 절세 추천 생성
 */
export function generateRecommendations(
  data: TaxFormData,
  taxResult: TaxCalculationResult
): TaxSavingRecommendation[] {
  const recommendations: TaxSavingRecommendation[] = [];
  const { income, deductions } = data;

  // 1. 신용카드/체크카드 사용 추천
  const cardRecommendation = recommendCardUsage(
    income.totalSalary,
    deductions.creditCard,
    deductions.debitCard
  );
  if (cardRecommendation) {
    recommendations.push(cardRecommendation);
  }

  // 2. 전통시장 사용 추천
  const marketRecommendation = recommendTraditionalMarket(
    deductions.traditionalMarket
  );
  if (marketRecommendation) {
    recommendations.push(marketRecommendation);
  }

  // 3. 대중교통 사용 추천
  const transportRecommendation = recommendPublicTransport(
    deductions.publicTransport
  );
  if (transportRecommendation) {
    recommendations.push(transportRecommendation);
  }

  // 4. 의료비 추천
  const medicalRecommendation = recommendMedical(
    income.totalSalary,
    deductions.medical
  );
  if (medicalRecommendation) {
    recommendations.push(medicalRecommendation);
  }

  // 5. 연금저축 추천
  const pensionRecommendation = recommendPensionSavings(
    income.totalSalary,
    deductions.pensionSavings
  );
  if (pensionRecommendation) {
    recommendations.push(pensionRecommendation);
  }

  // 우선순위로 정렬
  return recommendations.sort((a, b) => a.priority - b.priority);
}

/**
 * 신용카드/체크카드 사용 추천
 */
function recommendCardUsage(
  totalSalary: number,
  creditCard: number,
  debitCard: number
): TaxSavingRecommendation | null {
  const minUsage = totalSalary * CARD_DEDUCTION.MIN_USAGE_RATE;
  const totalUsage = creditCard + debitCard;

  // 최소 사용액 미달 시
  if (totalUsage < minUsage) {
    const additionalAmount = minUsage - totalUsage;
    const expectedSaving = additionalAmount * CARD_DEDUCTION.DEBIT_CARD_RATE * 0.15; // 세율 15% 가정

    return {
      category: '카드 사용',
      currentAmount: totalUsage,
      recommendedAmount: minUsage,
      expectedSaving: Math.round(expectedSaving),
      description: `카드 사용액이 최소 기준(총급여의 25%)에 미달합니다. 체크카드로 ${Math.round(additionalAmount).toLocaleString()}원을 추가 사용하면 약 ${Math.round(expectedSaving).toLocaleString()}원을 절세할 수 있습니다.`,
      priority: 1,
    };
  }

  // 신용카드를 체크카드로 전환 추천
  if (creditCard > 0) {
    const switchAmount = Math.min(creditCard, 10_000_000); // 1천만원까지 전환 추천
    const currentDeduction = switchAmount * CARD_DEDUCTION.CREDIT_CARD_RATE;
    const newDeduction = switchAmount * CARD_DEDUCTION.DEBIT_CARD_RATE;
    const additionalSaving = (newDeduction - currentDeduction) * 0.15; // 세율 15% 가정

    if (additionalSaving > 50_000) {
      // 5만원 이상 절세 효과가 있을 때만 추천
      return {
        category: '카드 전환',
        currentAmount: creditCard,
        recommendedAmount: creditCard - switchAmount,
        expectedSaving: Math.round(additionalSaving),
        description: `신용카드 대신 체크카드를 사용하면 공제율이 15%에서 30%로 증가합니다. ${Math.round(switchAmount).toLocaleString()}원을 체크카드로 전환하면 약 ${Math.round(additionalSaving).toLocaleString()}원을 절세할 수 있습니다.`,
        priority: 2,
      };
    }
  }

  return null;
}

/**
 * 전통시장 사용 추천
 */
function recommendTraditionalMarket(
  traditionalMarket: number
): TaxSavingRecommendation | null {
  if (traditionalMarket < 1_000_000) {
    const additionalAmount = 1_000_000 - traditionalMarket;
    const expectedSaving = additionalAmount * CARD_DEDUCTION.TRADITIONAL_MARKET_RATE * 0.15;

    return {
      category: '전통시장 이용',
      currentAmount: traditionalMarket,
      recommendedAmount: 1_000_000,
      expectedSaving: Math.round(expectedSaving),
      description: `전통시장 사용액의 40%를 공제받을 수 있습니다. ${Math.round(additionalAmount).toLocaleString()}원을 추가로 사용하면 약 ${Math.round(expectedSaving).toLocaleString()}원을 절세할 수 있습니다.`,
      priority: 3,
    };
  }

  return null;
}

/**
 * 대중교통 사용 추천
 */
function recommendPublicTransport(
  publicTransport: number
): TaxSavingRecommendation | null {
  if (publicTransport < 500_000) {
    const additionalAmount = 500_000 - publicTransport;
    const expectedSaving = additionalAmount * CARD_DEDUCTION.PUBLIC_TRANSPORT_RATE * 0.15;

    return {
      category: '대중교통 이용',
      currentAmount: publicTransport,
      recommendedAmount: 500_000,
      expectedSaving: Math.round(expectedSaving),
      description: `대중교통 사용액의 40%를 공제받을 수 있습니다. ${Math.round(additionalAmount).toLocaleString()}원을 추가로 사용하면 약 ${Math.round(expectedSaving).toLocaleString()}원을 절세할 수 있습니다.`,
      priority: 4,
    };
  }

  return null;
}

/**
 * 의료비 추천
 */
function recommendMedical(
  totalSalary: number,
  medical: number
): TaxSavingRecommendation | null {
  const minExpense = totalSalary * 0.03;

  if (medical > minExpense && medical < minExpense + 5_000_000) {
    const additionalAmount = 2_000_000;
    const expectedSaving = additionalAmount * 0.15;

    return {
      category: '의료비 몰아쓰기',
      currentAmount: medical,
      recommendedAmount: medical + additionalAmount,
      expectedSaving: Math.round(expectedSaving),
      description: `연말에 필요한 의료비를 몰아서 지출하면 총급여의 3% 초과분에 대해 15%를 공제받을 수 있습니다. 안경 구입, 건강검진 등을 연말에 집중하세요.`,
      priority: 5,
    };
  }

  return null;
}

/**
 * 연금저축 추천
 */
function recommendPensionSavings(
  totalSalary: number,
  pensionSavings: number
): TaxSavingRecommendation | null {
  const limit = TAX_CREDIT_LIMIT.PENSION_SAVINGS;
  const rate =
    totalSalary <= 55_000_000
      ? TAX_CREDIT_LIMIT.PENSION_RATE_HIGH
      : TAX_CREDIT_LIMIT.PENSION_RATE_LOW;

  if (pensionSavings < limit) {
    const additionalAmount = Math.min(limit - pensionSavings, 3_000_000); // 최대 300만원까지 추천
    const expectedSaving = additionalAmount * rate;

    return {
      category: '연금저축',
      currentAmount: pensionSavings,
      recommendedAmount: pensionSavings + additionalAmount,
      expectedSaving: Math.round(expectedSaving),
      description: `연금저축 납입액의 ${rate * 100}%를 세액공제 받을 수 있습니다. ${Math.round(additionalAmount).toLocaleString()}원을 추가 납입하면 약 ${Math.round(expectedSaving).toLocaleString()}원을 바로 절세할 수 있습니다. (한도: 연 ${(limit / 10000).toFixed(0)}만원)`,
      priority: 1,
    };
  }

  return null;
}
