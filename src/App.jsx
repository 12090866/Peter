import { useMemo, useState } from 'react';
import { calculateBoxQuote } from './calculateBoxQuote';
import { calculateQuote } from './calculateQuote';
import { defaultBoxInput } from './boxConfig';
import { appMode } from './priceConfig';
import BoxQuoteForm from './components/BoxQuoteForm';
import BoxQuoteResult from './components/BoxQuoteResult';
import Header from './components/Header';
import QuoteForm from './components/QuoteForm';
import QuotePdfModal from './components/QuotePdfModal';
import QuoteResult from './components/QuoteResult';

export default function App() {
  const [debugMode] = useState(appMode.showFormulaDebug);
  const [activeCalculator, setActiveCalculator] = useState('book');
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [input, setInput] = useState({
    size: 'A4',
    pages: 84,
    quantity: 500,
    coverPaperType: '銅西卡250p',
    coverColorCount: 4,
    paperType: '高級道林120p',
    innerPrintSides: 2,
    innerColorCount: 1,
    selectedFinishing: [],
    bindingType: '膠裝',
  });
  const [boxInput, setBoxInput] = useState(defaultBoxInput);

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

  const boxResult = useMemo(() => {
    try {
      return calculateBoxQuote(boxInput);
    } catch (error) {
      console.error('彩盒計算失敗：', error);
      return null;
    }
  }, [boxInput]);

  const isBookCalculator = activeCalculator === 'book';

  return (
    <div className="app">
      <Header debugMode={debugMode} />
      <nav className="calculator-tabs" aria-label="報價類型">
        <button
          type="button"
          className={`calculator-tab ${isBookCalculator ? 'calculator-tab-active' : ''}`}
          onClick={() => setActiveCalculator('book')}
        >
          書籍報價
        </button>
        <button
          type="button"
          className={`calculator-tab ${!isBookCalculator ? 'calculator-tab-active' : ''}`}
          onClick={() => setActiveCalculator('box')}
        >
          彩盒報價
        </button>
      </nav>
      <main className="main-layout">
        <aside className="main-left">
          {isBookCalculator ? (
            <QuoteForm input={input} onChange={setInput} debugMode={debugMode} />
          ) : (
            <BoxQuoteForm input={boxInput} onChange={setBoxInput} result={boxResult} />
          )}
        </aside>
        <section className="main-right">
          {isBookCalculator ? (
            <QuoteResult
              result={result}
              debugMode={debugMode}
              onOpenPdfModal={() => setIsPdfModalOpen(true)}
            />
          ) : (
            <BoxQuoteResult result={boxResult} debugMode={debugMode} />
          )}
        </section>
      </main>
      {isBookCalculator && (
        <QuotePdfModal
          isOpen={isPdfModalOpen}
          onClose={() => setIsPdfModalOpen(false)}
          result={result}
        />
      )}
    </div>
  );
}
