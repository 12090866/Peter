import { useEffect, useState } from 'react';
import { formatCurrency, formatDate, formatNumber } from '../utils/format';

export default function QuotePdfModal({ isOpen, onClose, result }) {
  const [clientName, setClientName] = useState('客戶名稱');
  const [clientContact, setClientContact] = useState('');
  const [quoteId, setQuoteId] = useState('');
  const [validDays, setValidDays] = useState(30);
  const [remarks, setRemarks] = useState(
    '1. 本報價有效期為 30 天。\n2. 紙價與加工價格如有異動，正式下單前需再次確認。\n3. 交期需依完稿、打樣與現場排程確認。',
  );

  useEffect(() => {
    if (!isOpen) return;

    const today = new Date();
    const dateKey = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;
    setQuoteId(`HC-${dateKey}-${Math.floor(100 + Math.random() * 900)}`);
  }, [isOpen]);

  if (!isOpen || !result) return null;

  const { binding, finishing, input, paper, plates, printing, sizeRule, total, units } =
    result;

  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + Number(validDays || 30));

  const rows = [
    ['內頁紙張', `${paper.selectedPaper}，${formatNumber(paper.innerReams, 2)} 令`, paper.innerPaperCost],
    ['封面紙張', `${paper.coverPaper}，${formatNumber(paper.coverReams, 2)} 令`, paper.coverPaperCost],
    ['製版費', `封面 ${plates.coverPlates} 版，內頁 ${plates.innerPlates} 版`, plates.plateCost],
    ['內頁印刷', `${formatNumber(printing.innerKiloRuns, 2)} 千車 x ${printing.innerBillingColorCount} 計價色 x ${units.billingUnits} 台`, printing.innerPrintingCost],
    ['封面印刷', `${formatNumber(printing.coverKiloRuns, 2)} 千車 x ${printing.coverBillingColorCount} 計價色`, printing.coverPrintingCost],
    ['後加工', finishing.selectedFinishing.join('、') || '無', finishing.finishingCost],
    ['裝訂', `${binding.bindingType}，單價 ${binding.bindingUnitPrice}，基本價 ${formatCurrency(binding.bindingBasePrice)}`, binding.bindingCost],
  ];

  return (
    <div className="pdf-modal-overlay">
      <div className="pdf-modal-container">
        <div className="pdf-modal-header">
          <div className="pdf-modal-header-left">
            <h3>正式報價單</h3>
            <span className="badge badge-info">A4 預覽</span>
          </div>
          <button className="btn-close-modal" type="button" onClick={onClose}>
            x
          </button>
        </div>

        <div className="pdf-modal-body">
          <div className="pdf-modal-form-panel">
            <h4 className="panel-section-title">報價資料</h4>
            <div className="form-group">
              <label className="form-label">客戶名稱</label>
              <input
                className="form-input"
                value={clientName}
                onChange={(event) => setClientName(event.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">聯絡資訊</label>
              <input
                className="form-input"
                value={clientContact}
                onChange={(event) => setClientContact(event.target.value)}
              />
            </div>
            <div className="form-row">
              <div className="form-group form-group-half">
                <label className="form-label">報價單號</label>
                <input
                  className="form-input"
                  value={quoteId}
                  onChange={(event) => setQuoteId(event.target.value)}
                />
              </div>
              <div className="form-group form-group-half">
                <label className="form-label">有效天數</label>
                <input
                  type="number"
                  className="form-input"
                  min="1"
                  value={validDays}
                  onChange={(event) => setValidDays(event.target.value)}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">備註</label>
              <textarea
                className="form-input"
                rows="6"
                value={remarks}
                onChange={(event) => setRemarks(event.target.value)}
              />
            </div>
            <div className="pdf-modal-actions">
              <button className="btn btn-secondary-modal" type="button" onClick={onClose}>
                返回
              </button>
              <button className="btn btn-primary-modal" type="button" onClick={() => window.print()}>
                列印 / 存成 PDF
              </button>
            </div>
          </div>

          <div className="pdf-modal-preview-panel">
            <div className="a4-preview-scroll-container">
              <QuotationSheet
                clientContact={clientContact}
                clientName={clientName}
                expiryDate={expiryDate}
                input={input}
                quoteId={quoteId}
                remarks={remarks}
                rows={rows}
                sizeRule={sizeRule}
                total={total}
                units={units}
              />
            </div>
          </div>
        </div>

        <div id="quote-print-template">
          <QuotationSheet
            clientContact={clientContact}
            clientName={clientName}
            expiryDate={expiryDate}
            input={input}
            quoteId={quoteId}
            remarks={remarks}
            rows={rows}
            sizeRule={sizeRule}
            total={total}
            units={units}
          />
        </div>
      </div>
    </div>
  );
}

function QuotationSheet({
  clientContact,
  clientName,
  expiryDate,
  input,
  quoteId,
  remarks,
  rows,
  sizeRule,
  total,
  units,
}) {
  return (
    <div className="a4-page">
      <div className="quote-sheet-header">
        <div>
          <h1 className="quote-sheet-company-name">鴻彩印刷有限公司</h1>
          <p className="quote-sheet-company-detail">
            台北市中正區印刷路 100 號 4 樓
            <br />
            Tel: (02) 2345-6789 · service@hongcai-print.com
          </p>
        </div>
        <div className="quote-sheet-title-right">
          <h2 className="quote-sheet-main-title">報價單</h2>
          <p className="quote-sheet-number">{quoteId}</p>
        </div>
      </div>

      <div className="quote-sheet-meta-grid">
        <div>
          <p className="meta-row">
            <span className="meta-label">客戶</span>
            <span className="meta-value bold-text">{clientName}</span>
          </p>
          <p className="meta-row">
            <span className="meta-label">聯絡</span>
            <span className="meta-value">{clientContact || '-'}</span>
          </p>
          <p className="meta-row">
            <span className="meta-label">規格</span>
            <span className="meta-value">
              {input.size} · {input.pages}頁 · {formatNumber(input.quantity)}本
            </span>
          </p>
        </div>
        <div>
          <p className="meta-row">
            <span className="meta-label">日期</span>
            <span className="meta-value">{formatDate()}</span>
          </p>
          <p className="meta-row">
            <span className="meta-label">有效至</span>
            <span className="meta-value">{formatDate(expiryDate)}</span>
          </p>
        </div>
      </div>

      <table className="quote-sheet-table">
        <thead>
          <tr>
            <th>項目</th>
            <th>說明</th>
            <th className="text-right">金額</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([name, detail, amount]) => (
            <tr key={name}>
              <td>{name}</td>
              <td>{detail}</td>
              <td className="text-right">{formatCurrency(amount)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="2" className="text-right bold-text">
              預估總價
            </td>
            <td className="text-right footer-value">{formatCurrency(total.totalPrice)}</td>
          </tr>
          <tr>
            <td colSpan="2" className="text-right bold-text">
              單本成本
            </td>
            <td className="text-right footer-value">{formatCurrency(total.unitPrice)}</td>
          </tr>
        </tfoot>
      </table>

      <div className="quote-sheet-footer">
        <div>
          <h5 className="remarks-title">備註</h5>
          <p className="remarks-content">{remarks}</p>
        </div>
        <div className="signature-box">
          <p className="sig-title">客戶確認</p>
          <div className="sig-line" />
          <p className="sig-date">年　月　日</p>
        </div>
      </div>
    </div>
  );
}
