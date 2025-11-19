# 🧾 Tax-Mate

연말정산 시뮬레이션과 맞춤형 절세 전략을 제공하는 스마트 세무 도우미

## 📋 프로젝트 소개

Tax-Mate는 연말정산 예상 세액을 계산하고, 개인 맞춤형 절세 전략을 추천해주는 웹 애플리케이션입니다.
DB 저장 없이 클라이언트에서 실시간으로 계산하여 개인정보 보호를 보장합니다.

### 주요 기능

- ✅ **실시간 세액 계산**: 2024년 세법 기준 정확한 연말정산 계산
- ✅ **맞춤형 절세 추천**: 개인 상황에 맞는 절세 전략 제시
- ✅ **직관적인 UI**: shadcn/ui 기반의 깔끔하고 현대적인 디자인
- ✅ **개인정보 보호**: 서버 저장 없이 클라이언트에서만 처리

## 🛠️ 기술 스택

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **UI Library**: shadcn/ui + TailwindCSS
- **Icons**: Lucide React
- **State Management**: Zustand
- **Form Handling**: React Hook Form + Zod

### 계산 로직
- 2024년 근로소득세 세율표
- 신용카드/체크카드 소득공제
- 의료비/교육비/기부금 공제
- 연금저축 세액공제
- 인적공제

## 🚀 시작하기

### 요구사항
- Node.js 18.18.0 이상 (권장: 20.9.0 이상)
- npm 9.8.1 이상

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

### 빌드

```bash
# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm run start
```

## 📁 프로젝트 구조

```
tax-mate/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx         # 루트 레이아웃
│   │   └── page.tsx           # 메인 페이지
│   ├── components/
│   │   ├── ui/                # shadcn/ui 기본 컴포넌트
│   │   ├── forms/             # 입력 폼 컴포넌트
│   │   └── layout/            # 레이아웃 컴포넌트
│   ├── lib/
│   │   ├── tax/               # 세금 계산 로직
│   │   │   ├── calculator.ts # 메인 계산기
│   │   │   ├── tax-rates.ts  # 세율표
│   │   │   ├── deductions.ts # 공제 계산
│   │   │   └── recommendations.ts # 절세 추천
│   │   ├── validations/       # Zod 스키마
│   │   └── utils.ts           # 유틸리티 함수
│   ├── stores/                # Zustand 스토어
│   └── types/                 # TypeScript 타입 정의
├── public/                    # 정적 파일
└── package.json
```

## 💡 사용 방법

1. **소득 정보 입력**: 총 급여액, 근무 개월 수 입력
2. **부양가족 정보**: 배우자, 자녀, 기타 부양가족 수 입력
3. **공제 항목 입력**: 카드 사용액, 의료비, 교육비 등 입력
4. **계산하기**: 버튼 클릭으로 즉시 결과 확인
5. **절세 전략 확인**: 맞춤형 절세 추천 사항 확인

## ⚠️ 주의사항

- 본 서비스는 참고용이며 실제 연말정산 결과와 다를 수 있습니다
- 정확한 세액은 국세청 홈택스를 참고하세요
- 간이세액표는 평균값으로 계산되어 실제와 차이가 있을 수 있습니다

## 🔮 향후 계획

- [ ] 차트 시각화 추가 (Recharts)
- [ ] 전년도 대비 비교 기능
- [ ] PDF 보고서 다운로드
- [ ] 공제 항목별 상세 설명
- [ ] 모바일 최적화 강화

## 📝 라이선스

MIT License

## 👤 작성자

연말정산 절세를 도와주는 Tax-Mate

---

**Made with ❤️ using Next.js + TypeScript**
