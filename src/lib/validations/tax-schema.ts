/**
 * 연말정산 입력 유효성 검증 스키마
 */

import { z } from 'zod';

/**
 * 소득 정보 스키마
 */
export const incomeSchema = z.object({
  totalSalary: z
    .number()
    .min(0, '총 급여액은 0 이상이어야 합니다')
    .max(10_000_000_000, '금액이 너무 큽니다'),
  workMonths: z
    .number()
    .min(1, '근무 개월은 1개월 이상이어야 합니다')
    .max(12, '근무 개월은 12개월을 초과할 수 없습니다'),
});

/**
 * 공제 항목 스키마
 */
export const deductionSchema = z.object({
  creditCard: z.number().min(0, '금액은 0 이상이어야 합니다').default(0),
  debitCard: z.number().min(0, '금액은 0 이상이어야 합니다').default(0),
  traditionalMarket: z.number().min(0, '금액은 0 이상이어야 합니다').default(0),
  publicTransport: z.number().min(0, '금액은 0 이상이어야 합니다').default(0),
  medical: z.number().min(0, '금액은 0 이상이어야 합니다').default(0),
  education: z.number().min(0, '금액은 0 이상이어야 합니다').default(0),
  donation: z.number().min(0, '금액은 0 이상이어야 합니다').default(0),
  housingFund: z.number().min(0, '금액은 0 이상이어야 합니다').default(0),
  pensionSavings: z.number().min(0, '금액은 0 이상이어야 합니다').default(0),
  personalPension: z.number().min(0, '금액은 0 이상이어야 합니다').default(0),
});

/**
 * 부양가족 정보 스키마
 */
export const dependentSchema = z.object({
  hasSpouse: z.boolean().default(false),
  numberOfChildren: z
    .number()
    .min(0, '자녀 수는 0 이상이어야 합니다')
    .max(20, '자녀 수가 너무 많습니다')
    .default(0),
  numberOfOtherDependents: z
    .number()
    .min(0, '부양가족 수는 0 이상이어야 합니다')
    .max(20, '부양가족 수가 너무 많습니다')
    .default(0),
});

/**
 * 전체 폼 스키마
 */
export const taxFormSchema = z.object({
  income: incomeSchema,
  deductions: deductionSchema,
  dependents: dependentSchema,
});

export type IncomeFormValues = z.infer<typeof incomeSchema>;
export type DeductionFormValues = z.infer<typeof deductionSchema>;
export type DependentFormValues = z.infer<typeof dependentSchema>;
export type TaxFormValues = z.infer<typeof taxFormSchema>;
