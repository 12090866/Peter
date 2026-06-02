import { useMemo, useState } from 'react';
import { calculateQuote } from './calculateQuote';
import { appMode } from './priceConfig';
import Header from './components/Header';
import QuoteForm from './components/QuoteForm';
import QuotePdfModal from './components/QuotePdfModal';
import QuoteResult from './components/QuoteResult';

export default function App() {
  const [debugMode] = useState(appMode.showFormulaDebug);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [input, setInput] = useState({
    size: 'A4',
    pages: 84,
    quantity: 500,
    paperType: '高級道林120p',
    innerPrintSides: 2,
    innerColorCount: 1,
    selectedFinishing: [],
    bindingType: '膠裝',
  });

  const result = useMemo(() => {
    if (!input.pages || !input.quantity || Number(input.quantity) <= 0) {
      return null;
    }

    try {
      return calculateQuote(input);
    } catch (error) {
      console.error('報價計算失敗：', error);
      return null;
    }
  }, [input]);

  return (
    <div className="app">
      <Header debugMode={debugMode} />
      <main className="main-layout">
        <aside className="main-left">
          <QuoteForm input={input} onChange={setInput} debugMode={debugMode} />
        </aside>
        <section className="main-right">
          <QuoteResult
            result={result}
            debugMode={debugMode}
            onOpenPdfModal={() => setIsPdfModalOpen(true)}
          />
        </section>
      </main>
      <QuotePdfModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        result={result}
      />
    </div>
  );
}
