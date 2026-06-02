import { formatCurrency } from '../utils/format';

export default function QuoteSummaryCard({ total, debugMode, onOpenPdfModal }) {
  if (!total) return null;

  return (
    <div className="summary-card">
      <div className="summary-card-header">
        <h2 className="summary-card-title">報價總覽</h2>
        <span className={`badge ${debugMode ? 'badge-debug' : 'badge-simple'}`}>
          {debugMode ? '含公式明細' : '業務模式'}
        </span>
      </div>
      <div className="summary-card-body">
        <div className="summary-price-group">
          <div className="summary-price-item summary-price-total">
            <span className="summary-price-label">預估總價</span>
            <span className="summary-price-value">{formatCurrency(total.totalPrice)}</span>
          </div>
          <div className="summary-price-item summary-price-unit">
            <span className="summary-price-label">單本成本</span>
            <span className="summary-price-value">
              {formatCurrency(total.unitPrice)}
              <span className="summary-price-suffix"> / 本</span>
            </span>
          </div>
        </div>
        <button type="button" className="btn btn-generate-pdf" onClick={onOpenPdfModal}>
          產生正式報價單
        </button>
        <p className="summary-disclaimer">
          此為內部快速試算，正式報價需再確認紙價、加工與交期。
        </p>
      </div>
    </div>
  );
}
