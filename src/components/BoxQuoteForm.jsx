import {
  boxCoatingOptions,
  corrugatedOptions,
} from '../boxConfig';

export default function BoxQuoteForm({ input, onChange, result }) {
  const handleChange = (field, value) => {
    onChange({ ...input, [field]: value });
  };

  const handleNumberChange = (field, value) => {
    const number = Number(value);
    handleChange(field, Number.isNaN(number) ? '' : number);
  };

  const handleToggleArray = (field, option, checked) => {
    const current = input[field] || [];
    const next = checked
      ? [...current, option]
      : current.filter((item) => item !== option);
    handleChange(field, [...new Set(next)]);
  };

  return (
    <div className="quote-form">
      <div className="form-card">
        <div className="form-card-header">
          <span className="form-card-number">1</span>
          <h3 className="form-card-title">彩盒規格</h3>
        </div>
        <div className="form-card-body">
          <div className="form-row">
            <NumberField
              label="訂購數量"
              value={input.quantity}
              min="1"
              onChange={(value) => handleNumberChange('quantity', value)}
            />
            <NumberField
              label="色數"
              value={input.colorCount}
              min="1"
              max="6"
              onChange={(value) => handleNumberChange('colorCount', value)}
            />
          </div>
          <div className="form-row">
            <NumberField
              label="紙張長度 mm"
              value={input.sheetLength}
              min="1"
              onChange={(value) => handleNumberChange('sheetLength', value)}
            />
            <NumberField
              label="紙張寬度 mm"
              value={input.sheetWidth}
              min="1"
              onChange={(value) => handleNumberChange('sheetWidth', value)}
            />
          </div>
          <div className="form-row">
            <NumberField
              label="單模長度 mm"
              value={input.modelLength}
              min="1"
              onChange={(value) => handleNumberChange('modelLength', value)}
            />
            <NumberField
              label="單模寬度 mm"
              value={input.modelWidth}
              min="1"
              onChange={(value) => handleNumberChange('modelWidth', value)}
            />
          </div>
          <NumberField
            label="實際拼模數"
            value={input.impositionCount}
            min="1"
            onChange={(value) => handleNumberChange('impositionCount', value)}
          />
          {result?.imposition && (
            <p className="form-hint">
              系統建議最多 {result.imposition.suggested} 模（直放 {result.imposition.normal} 模，旋轉 {result.imposition.rotated} 模），實際仍以刀模、咬口與間距確認。
            </p>
          )}
        </div>
      </div>

      <div className="form-card">
        <div className="form-card-header">
          <span className="form-card-number">2</span>
          <h3 className="form-card-title">印刷與加工單價</h3>
        </div>
        <div className="form-card-body">
          <NumberField
            label="印刷單價（每千車每色）"
            value={input.printingUnitPrice}
            min="0"
            step="0.01"
            onChange={(value) => handleNumberChange('printingUnitPrice', value)}
          />
          <div className="form-group">
            <label className="form-label">上光（可多選）</label>
            <div className="form-checkbox-list">
              {Object.entries(boxCoatingOptions)
                .filter(([value]) => value !== 'none')
                .map(([value, option]) => {
                  const checked = (input.selectedCoatings || []).includes(value);
                  return (
                    <label key={value} className="form-checkbox-label">
                      <input
                        type="checkbox"
                        className="form-checkbox-input"
                        checked={checked}
                        onChange={(event) =>
                          handleToggleArray('selectedCoatings', value, event.target.checked)
                        }
                      />
                      <span className="checkbox-custom-label">{option.label}</span>
                    </label>
                  );
                })}
            </div>
          </div>
          <div className="form-row">
            <NumberField
              label="上光單價 / 車"
              value={input.coatingUnitPrice}
              min="0"
              step="0.01"
              onChange={(value) => handleNumberChange('coatingUnitPrice', value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">裱浪（可多選）</label>
            <div className="form-checkbox-list">
              {Object.entries(corrugatedOptions)
                .filter(([value]) => value !== 'none')
                .map(([value, option]) => {
                  const checked = (input.selectedCorrugated || []).includes(value);
                  return (
                    <label key={value} className="form-checkbox-label">
                      <input
                        type="checkbox"
                        className="form-checkbox-input"
                        checked={checked}
                        onChange={(event) =>
                          handleToggleArray(
                            'selectedCorrugated',
                            value,
                            event.target.checked,
                          )
                        }
                      />
                      <span className="checkbox-custom-label">{option.label}</span>
                    </label>
                  );
                })}
            </div>
          </div>
          <div className="form-row">
            <NumberField
              label="浪紙基準單價"
              value={input.corrugatedPaperUnitPrice}
              min="0"
              step="0.01"
              onChange={(value) =>
                handleNumberChange('corrugatedPaperUnitPrice', value)
              }
            />
          </div>
          <NumberField
            label="裱浪加工基準單價"
            value={input.mountingUnitPrice}
            min="0"
            step="0.01"
            onChange={(value) => handleNumberChange('mountingUnitPrice', value)}
          />
        </div>
      </div>

      <div className="form-card">
        <div className="form-card-header">
          <span className="form-card-number">3</span>
          <h3 className="form-card-title">軋型與糊盒</h3>
        </div>
        <div className="form-card-body">
          <label className="form-checkbox-label form-checkbox-row">
            <input
              type="checkbox"
              className="form-checkbox-input"
              checked={input.dieCutEnabled}
              onChange={(event) => handleChange('dieCutEnabled', event.target.checked)}
            />
            <span className="checkbox-custom-label">計算軋型</span>
          </label>
          <NumberField
            label="軋型單價 / 車"
            value={input.dieCutUnitPrice}
            min="0"
            step="0.01"
            onChange={(value) => handleNumberChange('dieCutUnitPrice', value)}
          />
          <label className="form-checkbox-label form-checkbox-row">
            <input
              type="checkbox"
              className="form-checkbox-input"
              checked={input.gluingEnabled}
              onChange={(event) => handleChange('gluingEnabled', event.target.checked)}
            />
            <span className="checkbox-custom-label">計算糊盒</span>
          </label>
          <NumberField
            label="糊盒單價 / 個"
            value={input.gluingUnitPrice}
            min="0"
            step="0.01"
            onChange={(value) => handleNumberChange('gluingUnitPrice', value)}
          />
        </div>
      </div>
    </div>
  );
}

function NumberField({ label, value, onChange, min, max, step = '1' }) {
  return (
    <div className="form-group form-group-half">
      <label className="form-label">{label}</label>
      <input
        type="number"
        className="form-input"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
