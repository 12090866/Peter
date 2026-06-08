import AiSummaryCard from './AiSummaryCard';
import BreakdownCard from './BreakdownCard';
import PriceRow from './PriceRow';
import QuoteSummaryCard from './QuoteSummaryCard';
import WarningPanel from './WarningPanel';

export default function QuoteResult({ result, debugMode, onOpenPdfModal }) {
  if (!result) {
    return (
      <div className="quote-result">
        <div className="quote-result-empty">
          <h3>等待輸入</h3>
          <p>請在左側填入規格，系統會即時計算報價。</p>
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
    binding,
    finishing,
    input,
    paper,
    plates,
    printSettings,
    printing,
    sizeRule,
    total,
    units,
    warnings,
  } = result;

  return (
    <div className="quote-result">
      <QuoteSummaryCard
        total={total}
        debugMode={debugMode}
        onOpenPdfModal={onOpenPdfModal}
      />
      <WarningPanel warnings={warnings} />
      <AiSummaryCard summary={result.aiSummary} />

      {debugMode && (
        <>
          <BreakdownCard
            title="尺寸與台數"
            badge={units.theoreticalUnits !== units.billingUnits ? '已進位' : ''}
            badgeType="warning"
          >
            <PriceRow label="尺寸" value={sizeRule.size} />
            <PriceRow label="紙張系統" value={`${sizeRule.paperSystem} 系`} />
            <PriceRow label="全紙尺寸" value={sizeRule.sheetSize} />
            <PriceRow label="系列" value={sizeRule.seriesLabel} />
            <PriceRow label="每台頁數" value={sizeRule.pagesPerUnit} unit="頁" />
            <PriceRow
              label="理論台數"
              value={units.theoreticalUnits}
              unit="台"
              formula={`${input.pages} / ${sizeRule.pagesPerUnit}`}
              showFormula
            />
            <PriceRow
              label="報價台數"
              value={units.billingUnits}
              unit="台"
              highlight={units.theoreticalUnits !== units.billingUnits}
            />
          </BreakdownCard>

          <BreakdownCard title="紙張成本">
            <div className="breakdown-section">
              <h4 className="breakdown-section-title">內頁</h4>
              <PriceRow label="紙張" value={paper.selectedPaper} />
              <PriceRow label="令價" value={paper.innerReamPrice} isCurrency />
              <PriceRow label="張數" value={paper.innerSheets} unit="張" />
              <PriceRow label="令數" value={paper.innerReams} unit="令" />
              <PriceRow label="內頁紙成本" value={paper.innerPaperCost} isCurrency highlight />
            </div>
            <div className="breakdown-section">
              <h4 className="breakdown-section-title">封面</h4>
              <PriceRow label="紙張" value={paper.coverPaper} />
              <PriceRow label="令價" value={paper.coverReamPrice} isCurrency />
              <PriceRow label="張數" value={paper.coverSheets} unit="張" />
              <PriceRow label="令數" value={paper.coverReams} unit="令" />
              <PriceRow label="封面紙成本" value={paper.coverPaperCost} isCurrency highlight />
            </div>
          </BreakdownCard>

          <BreakdownCard title="製版與印刷">
            <PriceRow label="封面版數" value={plates.coverPlates} unit="版" />
            <PriceRow label="封面面數" value={printSettings.coverPrintSides} unit="面" />
            <PriceRow label="封面實際色數" value={printSettings.coverColorCount} unit="色" />
            <PriceRow label="內頁版數" value={plates.innerPlates} unit="版" />
            <PriceRow label="總版數" value={plates.totalPlates} unit="版" />
            <PriceRow
              label="封面製版費"
              value={plates.coverPlateCost}
              isCurrency
              formula={`${plates.coverPlates} 版 x ${plates.coverPlateUnitPrice}`}
              showFormula
            />
            <PriceRow
              label="內頁製版費"
              value={plates.innerPlateCost}
              isCurrency
              formula={`${plates.innerPlates} 版 x ${plates.innerPlateUnitPrice}`}
              showFormula
            />
            <PriceRow label="製版費" value={plates.plateCost} isCurrency highlight />
            <div className="breakdown-divider" />
            <PriceRow
              label="封面印刷"
              value={printing.coverPrintingCost}
              isCurrency
              formula={`${printing.coverKiloRuns.toFixed(2)} 千車 x ${printing.coverBillingColorCount} 計價色`}
              showFormula
            />
            <PriceRow
              label="內頁印刷"
              value={printing.innerPrintingCost}
              isCurrency
              formula={`${printing.innerKiloRuns.toFixed(2)} 千車 x ${printing.innerBillingColorCount} 計價色 x ${units.billingUnits} 台`}
              showFormula
            />
            <PriceRow label="內頁實際色數" value={printSettings.innerColorCount} unit="色" />
          </BreakdownCard>

          <BreakdownCard title="後加工與裝訂">
            <PriceRow label="封面後加工計價車數" value={finishing.coverCountedRuns} unit="車" />
            <PriceRow label="內頁後加工計價車數" value={finishing.innerCountedRuns} unit="車" />
            {finishing.selectedFinishing.length > 0 ? (
              finishing.selectedFinishing.map((item) => (
                <PriceRow
                  key={item}
                  label={item}
                  value={finishing.breakdown[item] || 0}
                  isCurrency
                />
              ))
            ) : (
              <PriceRow label="後加工" value={0} isCurrency />
            )}
            <PriceRow label="後加工小計" value={finishing.finishingCost} isCurrency highlight />
            <div className="breakdown-divider" />
            <PriceRow label="裝訂方式" value={binding.bindingType} />
            <PriceRow label="計價本數" value={binding.bindingQuantity} unit="本" />
            <PriceRow label="裝訂單價" value={binding.bindingUnitPrice} isCurrency />
            <PriceRow label="裝訂基本價" value={binding.bindingBasePrice} isCurrency />
            <PriceRow
              label="裝訂變動價"
              value={binding.variableBindingCost}
              isCurrency
              formula={`${binding.bindingQuantity} 本 x ${binding.bindingUnitPrice}`}
              showFormula
            />
            <PriceRow label="裝訂費" value={binding.bindingCost} isCurrency highlight />
          </BreakdownCard>
        </>
      )}
    </div>
  );
}
