import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TaxInputForm } from '@/components/forms/TaxInputForm';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <TaxInputForm />
      </main>
      <Footer />
    </div>
  );
}
