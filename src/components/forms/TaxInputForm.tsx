'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTaxStore } from '@/stores/useTaxStore';
import { taxFormSchema, type TaxFormValues } from '@/lib/validations/tax-schema';
import { formatCurrency } from '@/lib/utils';
import { Calculator } from 'lucide-react';

export function TaxInputForm() {
  const { formData, setIncome, setDeductions, setDependents, calculateTax, result } = useTaxStore();
  const [showResults, setShowResults] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaxFormValues>({
    resolver: zodResolver(taxFormSchema),
    defaultValues: formData,
  });

  const onSubmit = (data: TaxFormValues) => {
    setIncome(data.income);
    setDeductions(data.deductions);
    setDependents(data.dependents);
    calculateTax();
    setShowResults(true);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* 입력 폼 */}
      <div className="space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* 소득 정보 */}
          <Card>
            <CardHeader>
              <CardTitle>소득 정보</CardTitle>
              <CardDescription>근로소득 관련 정보를 입력하세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="totalSalary">총 급여액 (세전)</Label>
                <Input
                  id="totalSalary"
                  type="number"
                  placeholder="예: 50000000"
                  {...register('income.totalSalary', { valueAsNumber: true })}
                />
                {errors.income?.totalSalary && (
                  <p className="text-sm text-destructive">{errors.income.totalSalary.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="workMonths">근무 개월 수</Label>
                <Input
                  id="workMonths"
                  type="number"
                  placeholder="12"
                  defaultValue="12"
                  {...register('income.workMonths', { valueAsNumber: true })}
                />
                {errors.income?.workMonths && (
                  <p className="text-sm text-destructive">{errors.income.workMonths.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 부양가족 정보 */}
          <Card>
            <CardHeader>
              <CardTitle>부양가족 정보</CardTitle>
              <CardDescription>인적공제 대상 가족을 입력하세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hasSpouse">배우자</Label>
                <select
                  id="hasSpouse"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                  {...register('dependents.hasSpouse', { 
                    setValueAs: (v) => v === 'true' 
                  })}
                >
                  <option value="false">없음</option>
                  <option value="true">있음</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="numberOfChildren">자녀 수</Label>
                <Input
                  id="numberOfChildren"
                  type="number"
                  placeholder="0"
                  defaultValue="0"
                  {...register('dependents.numberOfChildren', { valueAsNumber: true })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="numberOfOtherDependents">기타 부양가족 수</Label>
                <Input
                  id="numberOfOtherDependents"
                  type="number"
                  placeholder="0"
                  defaultValue="0"
                  {...register('dependents.numberOfOtherDependents', { valueAsNumber: true })}
                />
              </div>
            </CardContent>
          </Card>

          {/* 카드 사용액 */}
          <Card>
            <CardHeader>
              <CardTitle>카드 사용액</CardTitle>
              <CardDescription>연간 카드 사용 금액을 입력하세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="creditCard">신용카드</Label>
                <Input
                  id="creditCard"
                  type="number"
                  placeholder="0"
                  defaultValue="0"
                  {...register('deductions.creditCard', { valueAsNumber: true })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="debitCard">체크카드/현금영수증</Label>
                <Input
                  id="debitCard"
                  type="number"
                  placeholder="0"
                  defaultValue="0"
                  {...register('deductions.debitCard', { valueAsNumber: true })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="traditionalMarket">전통시장</Label>
                <Input
                  id="traditionalMarket"
                  type="number"
                  placeholder="0"
                  defaultValue="0"
                  {...register('deductions.traditionalMarket', { valueAsNumber: true })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="publicTransport">대중교통</Label>
                <Input
                  id="publicTransport"
                  type="number"
                  placeholder="0"
                  defaultValue="0"
                  {...register('deductions.publicTransport', { valueAsNumber: true })}
                />
              </div>
            </CardContent>
          </Card>

          {/* 기타 공제 항목 */}
          <Card>
            <CardHeader>
              <CardTitle>기타 공제 항목</CardTitle>
              <CardDescription>의료비, 교육비 등을 입력하세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="medical">의료비</Label>
                <Input
                  id="medical"
                  type="number"
                  placeholder="0"
                  defaultValue="0"
                  {...register('deductions.medical', { valueAsNumber: true })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="education">교육비</Label>
                <Input
                  id="education"
                  type="number"
                  placeholder="0"
                  defaultValue="0"
                  {...register('deductions.education', { valueAsNumber: true })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="donation">기부금</Label>
                <Input
                  id="donation"
                  type="number"
                  placeholder="0"
                  defaultValue="0"
                  {...register('deductions.donation', { valueAsNumber: true })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="housingFund">주택자금 (임차차입금)</Label>
                <Input
                  id="housingFund"
                  type="number"
                  placeholder="0"
                  defaultValue="0"
                  {...register('deductions.housingFund', { valueAsNumber: true })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pensionSavings">연금저축</Label>
                <Input
                  id="pensionSavings"
                  type="number"
                  placeholder="0"
                  defaultValue="0"
                  {...register('deductions.pensionSavings', { valueAsNumber: true })}
                />
              </div>
            </CardContent>
          </Card>

          <Button type="submit" size="lg" className="w-full">
            <Calculator className="mr-2 h-5 w-5" />
            세액 계산하기
          </Button>
        </form>
      </div>

      {/* 결과 영역 */}
      <div className="space-y-6">
        {showResults && result ? (
          <>
            {/* 결과 요약 */}
            <Card>
              <CardHeader>
                <CardTitle>계산 결과</CardTitle>
                <CardDescription>연말정산 예상 결과입니다</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">총 급여액</span>
                    <span className="font-medium">{formatCurrency(result.taxResult.totalSalary)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">근로소득공제</span>
                    <span className="font-medium">-{formatCurrency(result.taxResult.earnedIncomeDeduction)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">총 소득공제</span>
                    <span className="font-medium">-{formatCurrency(result.taxResult.totalDeductions)}</span>
                  </div>
                  <div className="h-px bg-border" />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">과세표준</span>
                    <span className="font-medium">{formatCurrency(result.taxResult.taxBase)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">산출세액</span>
                    <span className="font-medium">{formatCurrency(result.taxResult.calculatedTax)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">세액공제</span>
                    <span className="font-medium">-{formatCurrency(result.taxResult.taxCredit)}</span>
                  </div>
                  <div className="h-px bg-border" />
                  <div className="flex justify-between">
                    <span className="font-semibold">결정세액</span>
                    <span className="font-semibold">{formatCurrency(result.taxResult.finalTax)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">기납부세액</span>
                    <span className="font-medium">{formatCurrency(result.taxResult.prepaidTax)}</span>
                  </div>
                  <div className="h-px bg-border" />
                  <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                    <span className="text-lg font-bold">
                      {result.taxResult.refundAmount >= 0 ? '환급 예상액' : '추가 납부액'}
                    </span>
                    <span className={`text-2xl font-bold ${
                      result.taxResult.refundAmount >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatCurrency(Math.abs(result.taxResult.refundAmount))}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 절세 추천 */}
            {result.recommendations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>절세 추천</CardTitle>
                  <CardDescription>
                    최대 {formatCurrency(result.totalPotentialSaving)}까지 더 절세할 수 있습니다
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {result.recommendations.map((rec, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{rec.category}</h4>
                        <span className="text-sm font-medium text-green-600">
                          +{formatCurrency(rec.expectedSaving)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{rec.description}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>계산 결과</CardTitle>
              <CardDescription>정보를 입력하고 계산 버튼을 눌러주세요</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Calculator className="h-16 w-16 mb-4" />
                <p>좌측 폼에 정보를 입력하면</p>
                <p>연말정산 결과가 여기에 표시됩니다</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
