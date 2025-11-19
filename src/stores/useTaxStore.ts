/**
 * 연말정산 상태 관리 스토어
 */

import { create } from 'zustand';
import type {
  TaxFormData,
  ConsultingResult,
  IncomeInfo,
  DeductionItems,
  DependentInfo,
} from '@/types/tax';
import { calculateYearEndTax } from '@/lib/tax/calculator';

interface TaxStore {
  // State
  formData: TaxFormData;
  result: ConsultingResult | null;
  isCalculating: boolean;
  currentStep: number;

  // Actions
  setIncome: (income: Partial<IncomeInfo>) => void;
  setDeductions: (deductions: Partial<DeductionItems>) => void;
  setDependents: (dependents: Partial<DependentInfo>) => void;
  setCurrentStep: (step: number) => void;
  calculateTax: () => void;
  resetForm: () => void;
}

const initialFormData: TaxFormData = {
  income: {
    totalSalary: 0,
    workMonths: 12,
  },
  deductions: {
    creditCard: 0,
    debitCard: 0,
    traditionalMarket: 0,
    publicTransport: 0,
    medical: 0,
    education: 0,
    donation: 0,
    housingFund: 0,
    pensionSavings: 0,
    personalPension: 0,
  },
  dependents: {
    hasSpouse: false,
    numberOfChildren: 0,
    numberOfOtherDependents: 0,
  },
};

export const useTaxStore = create<TaxStore>((set, get) => ({
  // Initial state
  formData: initialFormData,
  result: null,
  isCalculating: false,
  currentStep: 0,

  // Actions
  setIncome: (income) => {
    set((state) => ({
      formData: {
        ...state.formData,
        income: { ...state.formData.income, ...income },
      },
    }));
  },

  setDeductions: (deductions) => {
    set((state) => ({
      formData: {
        ...state.formData,
        deductions: { ...state.formData.deductions, ...deductions },
      },
    }));
  },

  setDependents: (dependents) => {
    set((state) => ({
      formData: {
        ...state.formData,
        dependents: { ...state.formData.dependents, ...dependents },
      },
    }));
  },

  setCurrentStep: (step) => {
    set({ currentStep: step });
  },

  calculateTax: () => {
    set({ isCalculating: true });

    try {
      const { formData } = get();
      const result = calculateYearEndTax(formData);
      set({ result, isCalculating: false });
    } catch (error) {
      console.error('세액 계산 중 오류:', error);
      set({ isCalculating: false });
    }
  },

  resetForm: () => {
    set({
      formData: initialFormData,
      result: null,
      currentStep: 0,
    });
  },
}));
