import { useState } from 'react';
import {
  boxCoatingOptions,
  corrugatedOptions,
} from '../boxConfig';
import { parseBoxNaturalLanguage } from '../utils/aiParser';

export default function BoxQuoteForm({ input, onChange, result }) {
  const [nlText, setNlText] = useState('');
  const [highlightFields, setHighlightFields] = useState({});

  const handleChange = (field, value) => {
    onChange({ ...input, [field]: value });
  };

  const handleNumberChange = (field, value) => {
    if (value === '') {
      handleChange(field, '');
      return;
    }

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

  const handleAiParse = () => {
    const parsed = parseBoxNaturalLanguage(nlText);
    if (!Object.keys(parsed).length) {
      alert('目前沒有辨識到可填入的彩盒規格，請試著加入數量、紙張尺寸、單模尺寸、拼模數或加工方式。');
      return;
    }

    onChange({ ...input, ...parsed });
    setHighlightFields(
      Object.fromEntries(Object.keys(parsed).map((field) => [field, true])),
    );
    window.setTimeout(() => setHighlightFields({}), 1600);
  };

  const getHighlightClass = (field) =>
    highlightFields[field] ? 'field-highlight-active' : '';

  return (
    <div className="quote-form">
      <div className="form-card form-card-ai">
        <div className="form-card-header">
          <span className="form-card-number">AI</span>
          <h3 className="form-card-title">快速填入</h3>
          <span className="badge badge-ai">彩盒自然語言</span>
        </div>
        <div className="form-card-body">
          <div className="form-group">
            <label className="form-label">彩盒需求描述</label>
            <textarea
              className="form-input form-textarea-nl"
              rows="3"
              value={nlText}
              onChange={(event) => setNlText(event.target.value)}
              placeholder="例：彩盒 40000個，紙張697x878，單模348x439，拼4模，四色，亮P，E浪，軋型0.8，糊盒0.25"
            />
          </div>
          <button
            type="button"
            className="btn btn-ai-parse"
            onClick={handleAiParse}
            disabled={!nlText.trim()}
          >
            套用到彩盒表單
          </button>
          <div className="nl-template-buttons">
            {[
              '彩盒 40000個，紙張697x878，單模348x439，拼4模，四色，亮P，E浪，軋型0.8，糊盒0.25',
              '數量20000個，紙張720x1020，盒型360x510，拼4模，六色，霧P水光，B浪E浪',
              '彩盒 5000個，紙張546x787，單模273x393，拼4模，單色，無上光，無裱浪，不用糊盒',
            ].map((template) => (
              <button
                key={template}
                type="button"
                className="nl-template-tag"
                onClick={() => setNlText(template)}
              >
                {template}
              </button>
            ))}
          </div>
        </div>
      </div>

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
              highlightClass={getHighlightClass('quantity')}
              onChange={(value) => handleNumberChange('quantity', value)}
            />
            <NumberField
              label="色數"
              value={input.colorCount}
              min="1"
              max="6"
              highlightClass={getHighlightClass('colorCount')}
              onChange={(value) => handleNumberChange('colorCount', value)}
            />
          </div>
          <div className="form-row">
            <NumberField
              label="紙張長度 mm"
              value={input.sheetLength}
              min="1"
              highlightClass={getHighlightClass('sheetLength')}
              onChange={(value) => handleNumberChange('sheetLength', value)}
            />
            <NumberField
              label="紙張寬度 mm"
              value={input.sheetWidth}
              min="1"
              highlightClass={getHighlightClass('sheetWidth')}
              onChange={(value) => handleNumberChange('sheetWidth', value)}
            />
          </div>
          <div className="form-row">
            <NumberField
              label="單模長度 mm"
              value={input.modelLength}
              min="1"
              highlightClass={getHighlightClass('modelLength')}
              onChange={(value) => handleNumberChange('modelLength', value)}
            />
            <NumberField
              label="單模寬度 mm"
              value={input.modelWidth}
              min="1"
              highlightClass={getHighlightClass('modelWidth')}
              onChange={(value) => handleNumberChange('modelWidth', value)}
            />
          </div>
          <NumberField
            label="實際拼模數"
            value={input.impositionCount}
            min="1"
            highlightClass={getHighlightClass('impositionCount')}
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
            highlightClass={getHighlightClass('printingUnitPrice')}
            onChange={(value) => handleNumberChange('printingUnitPrice', value)}
          />
          <div className={`form-group field-transition ${getHighlightClass('selectedCoatings')}`}>
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
              highlightClass={getHighlightClass('coatingUnitPrice')}
              onChange={(value) => handleNumberChange('coatingUnitPrice', value)}
            />
          </div>
          <div className={`form-group field-transition ${getHighlightClass('selectedCorrugated')}`}>
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
              highlightClass={getHighlightClass('corrugatedPaperUnitPrice')}
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
            highlightClass={getHighlightClass('mountingUnitPrice')}
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
          <label className={`form-checkbox-label form-checkbox-row field-transition ${getHighlightClass('dieCutEnabled')}`}>
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
            highlightClass={getHighlightClass('dieCutUnitPrice')}
            onChange={(value) => handleNumberChange('dieCutUnitPrice', value)}
          />
          <label className={`form-checkbox-label form-checkbox-row field-transition ${getHighlightClass('gluingEnabled')}`}>
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
            highlightClass={getHighlightClass('gluingUnitPrice')}
            onChange={(value) => handleNumberChange('gluingUnitPrice', value)}
          />
        </div>
      </div>
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
  min,
  max,
  step = '1',
  highlightClass = '',
}) {
  return (
    <div className={`form-group form-group-half field-transition ${highlightClass}`}>
      <label className="form-label">{label}</label>
      <input
        type="number"
        className="form-input"
        value={value ?? ''}
        min={min}
        max={max}
        step={step}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
