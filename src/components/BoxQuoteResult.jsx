import BreakdownCard from './BreakdownCard';
import PriceRow from './PriceRow';
import QuoteSummaryCard from './QuoteSummaryCard';
import WarningPanel from './WarningPanel';

export default function BoxQuoteResult({ result, debugMode }) {
  if (!result) {
    return (
      <div className="quote-result">
        <div className="quote-result-empty">
          <h3>等待輸入</h3>
          <p>請在左側填入彩盒規格，系統會即時計算成本。</p>
        </div>
      </div>
    );
  }

  if (result.hasBlockingError) {
    return (
      <div className="quote-result">
        <WarningPanel warnings={result.warnings} />
      </div>
    );
  }

  const {
    finishing,
    imposition,
    input,
    paper,
    plates,
    printing,
    total,
    warnings,
  } = result;

  return (
    <div className="quote-result">
      <QuoteSummaryCard total={total} debugMode={debugMode} unitLabel="個" />
      <WarningPanel warnings={warnings} />

      {debugMode && (
        <>
          <BreakdownCard
            title="拼版與車數"
            badge={input.impositionCount !== imposition.suggested ? '手動拼模' : ''}
            badgeType="warning"
          >
            <PriceRow label="紙張尺寸" value={`${input.sheetLength} x ${input.sheetWidth}`} unit="mm" />
            <PriceRow label="單模尺寸" value={`${input.modelLength} x ${input.modelWidth}`} unit="mm" />
            <PriceRow label="建議拼模數" value={imposition.suggested} unit="模" />
            <PriceRow label="實際拼模數" value={input.impositionCount} unit="模" highlight />
            <PriceRow
              label="印刷車數"
              value={printing.printRuns}
              unit="車"
              formula={`${input.quantity} / ${input.impositionCount}`}
              showFormula
            />
          </BreakdownCard>

          <BreakdownCard title="紙張與製版">
            <PriceRow label="紙張" value={paper.paperName} />
            <PriceRow
              label="紙張令價"
              value={paper.paperReamPrice}
              isCurrency
              formula={`3361 / 787 / 1092 x ${input.sheetLength} x ${input.sheetWidth}`}
              showFormula
            />
            <PriceRow label="紙張張價" value={paper.paperSheetPrice} isCurrency />
            <PriceRow label="使用令數" value={paper.paperReams} unit="令" />
            <PriceRow label="紙張成本" value={paper.paperCost} isCurrency highlight />
            <div className="breakdown-divider" />
            <PriceRow label="製版數" value={plates.plateCount} unit="塊" />
            <PriceRow
              label="製版費"
              value={plates.plateCost}
              isCurrency
              formula={`${plates.plateCount} 塊 x ${plates.plateUnitPrice}`}
              showFormula
              highlight
            />
          </BreakdownCard>

          <BreakdownCard title="印刷與上光">
            <PriceRow
              label="印刷費"
              value={printing.printingCost}
              isCurrency
              formula={`${input.colorCount} 色 x ${printing.printingKiloRuns.toFixed(2)} 千車 x ${printing.printingUnitPrice}`}
              showFormula
              highlight
            />
            {finishing.coatingBreakdown.length > 0 ? (
              finishing.coatingBreakdown.map((item) => (
                <PriceRow
                  key={item.key}
                  label={`上光-${item.label}`}
                  value={item.cost}
                  isCurrency
                  formula={`${printing.printRuns.toFixed(0)} 車 x ${input.coatingUnitPrice}`}
                  showFormula
                />
              ))
            ) : (
              <PriceRow label="上光" value="無" />
            )}
            <PriceRow label="上光小計" value={finishing.coatingCost} isCurrency highlight />
          </BreakdownCard>

          <BreakdownCard title="裱浪、軋型與糊盒">
            <PriceRow
              label="浪紙張價"
              value={finishing.corrugatedPaperSheetPrice}
              isCurrency
              formula={`${input.corrugatedPaperUnitPrice} / 787 / 1092 x ${input.sheetLength} x ${input.sheetWidth}`}
              showFormula={finishing.corrugatedBreakdown.length > 0}
            />
            <PriceRow
              label="裱浪加工張價"
              value={finishing.mountingSheetPrice}
              isCurrency
              formula={`${input.mountingUnitPrice} / 787 / 1092 x ${input.sheetLength} x ${input.sheetWidth}`}
              showFormula={finishing.corrugatedBreakdown.length > 0}
            />
            {finishing.corrugatedBreakdown.length > 0 ? (
              finishing.corrugatedBreakdown.map((item) => (
                <div key={item.key} className="breakdown-section">
                  <h4 className="breakdown-section-title">{item.label}</h4>
                  <PriceRow label="浪紙成本" value={item.corrugatedPaperCost} isCurrency />
                  <PriceRow label="裱浪加工費" value={item.mountingCost} isCurrency />
                  <PriceRow label={`${item.label} 小計`} value={item.total} isCurrency highlight />
                </div>
              ))
            ) : (
              <PriceRow label="裱浪" value="無" />
            )}
            <div className="breakdown-divider" />
            <PriceRow
              label="軋型"
              value={finishing.dieCutCost}
              isCurrency
              formula={`${printing.printRuns.toFixed(0)} 車 x ${input.dieCutUnitPrice}`}
              showFormula={input.dieCutEnabled}
            />
            <PriceRow
              label="糊盒"
              value={finishing.gluingCost}
              isCurrency
              formula={`${input.quantity} 個 x ${input.gluingUnitPrice}`}
              showFormula={input.gluingEnabled}
            />
          </BreakdownCard>

          <BreakdownCard title="彩盒總計">
            <PriceRow label="紙張成本" value={paper.paperCost} isCurrency />
            <PriceRow label="製版費" value={plates.plateCost} isCurrency />
            <PriceRow label="印刷費" value={printing.printingCost} isCurrency />
            <PriceRow label="上光費" value={finishing.coatingCost} isCurrency />
            <PriceRow label="裱浪費" value={finishing.corrugatedCost} isCurrency />
            <PriceRow label="軋型費" value={finishing.dieCutCost} isCurrency />
            <PriceRow label="糊盒費" value={finishing.gluingCost} isCurrency />
            <div className="breakdown-divider" />
            <PriceRow label="總價" value={total.totalPrice} isCurrency highlight />
            <PriceRow
              label="單個成本"
              value={total.unitPrice}
              isCurrency
              formula={`${Math.round(total.totalPrice).toLocaleString('zh-TW')} / ${input.quantity}`}
              showFormula
            />
          </BreakdownCard>
        </>
      )}
    </div>
  );
}
