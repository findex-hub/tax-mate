import { Calculator } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2">
          <Calculator className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Tax-Mate</h1>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          연말정산 절세 컨설팅 시뮬레이터
        </p>
      </div>
    </header>
  );
}
