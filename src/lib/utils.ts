import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 숫자를 천 단위 콤마로 포맷팅
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('ko-KR').format(num);
}

/**
 * 금액을 원화 형식으로 포맷팅
 */
export function formatCurrency(amount: number): string {
  return `${formatNumber(amount)}원`;
}

/**
 * 퍼센트 포맷팅
 */
export function formatPercent(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}
