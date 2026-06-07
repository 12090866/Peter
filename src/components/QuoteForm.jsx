import { useState } from 'react';
import {
  bindingOptions,
  finishingOptions,
  paperOptions,
  sizeGroups,
} from '../priceConfig';
import { parseNaturalLanguage } from '../utils/aiParser';

export default function QuoteForm({ input, onChange, debugMode }) {
  const [nlText, setNlText] = useState('');
  const [highlightFields, setHighlightFields] = useState({});

  const handleChange = (field, value) => {
    onChange({ ...input, [field]: value });
  };

  const handleNumberChange = (field, value) => {
    const number = Number.parseInt(value, 10);
    handleChange(field, Number.isNaN(number) ? '' : number);
  };

  const handleAiParse = () => {
    const parsed = parseNaturalLanguage(nlText);
    if (!Object.keys(parsed).length) {
      alert('目前沒有辨識到可填入的規格，請試著加入尺寸、頁數、印量或裝訂方式。');
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

  const pageError =
    input.pages !== '' && input.pages > 0 && input.pages % 4 !== 0
      ? '頁數需為 4 的倍數'
      : '';
  const quantityError =
    input.quantity !== '' && input.quantity <= 0 ? '印量需大於 0' : '';

  return (
    <div className="quote-form">
      <div className="form-card form-card-ai">
        <div className="form-card-header">
          <span className="form-card-number">AI</span>
          <h3 className="form-card-title">快速填入</h3>
          <span className="badge badge-ai">自然語言</span>
        </div>
        <div className="form-card-body">
          <div className="form-group">
            <label className="form-label">客戶需求描述</label>
            <textarea
              className="form-input form-textarea-nl"
              rows="3"
              value={nlText}
              onChange={(event) => setNlText(event.target.value)}
              placeholder="例：A4 膠裝 84頁 500本，內頁高級道林120p，雙面單色，無後加工"
            />
          </div>
          <button
            type="button"
            className="btn btn-ai-parse"
            onClick={handleAiParse}
            disabled={!nlText.trim()}
          >
            套用到表單
          </button>
          <div className="nl-template-buttons">
            {[
              'A4 膠裝 84頁 500本，高級道林120p，雙面單色，無後加工',
              'G16K 騎馬釘 64頁 1000本，雪銅120p，雙面四色，封面霧P',
              '16K 精裝 96頁 200本，銅西卡250p，雙面六色，局部光加版費',
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
          <h3 className="form-card-title">基本規格</h3>
        </div>
        <div className="form-card-body">
          <div className={`form-group field-transition ${getHighlightClass('size')}`}>
            <label className="form-label">尺寸</label>
            <select
              className="form-select"
              value={input.size}
              onChange={(event) => handleChange('size', event.target.value)}
            >
              {sizeGroups.map((group) => (
                <optgroup key={group.label} label={group.label}>
                  {group.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className={`form-group form-group-half field-transition ${getHighlightClass('pages')}`}>
              <label className="form-label">頁數</label>
              <input
                type="number"
                className={`form-input ${pageError ? 'form-input-error' : ''}`}
                value={input.pages}
                min="4"
                step="4"
                onChange={(event) => handleNumberChange('pages', event.target.value)}
              />
              {pageError && <p className="form-error">{pageError}</p>}
            </div>
            <div className={`form-group form-group-half field-transition ${getHighlightClass('quantity')}`}>
              <label className="form-label">印量</label>
              <input
                type="number"
                className={`form-input ${quantityError ? 'form-input-error' : ''}`}
                value={input.quantity}
                min="1"
                onChange={(event) => handleNumberChange('quantity', event.target.value)}
              />
              {quantityError && <p className="form-error">{quantityError}</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="form-card">
        <div className="form-card-header">
          <span className="form-card-number">2</span>
          <h3 className="form-card-title">紙張與印刷</h3>
        </div>
        <div className="form-card-body">
          <div className={`form-group field-transition ${getHighlightClass('paperType')}`}>
            <label className="form-label">內頁紙張</label>
            <select
              className="form-select"
              value={input.paperType}
              onChange={(event) => handleChange('paperType', event.target.value)}
            >
              {paperOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <p className="form-hint">封面預設以銅西卡250p估算。</p>
          </div>

          {debugMode && (
            <div className="form-row">
              <div className={`form-group form-group-half field-transition ${getHighlightClass('innerPrintSides')}`}>
                <label className="form-label">內頁面數</label>
                <select
                  className="form-select"
                  value={input.innerPrintSides}
                  onChange={(event) =>
                    handleChange('innerPrintSides', Number(event.target.value))
                  }
                >
                  <option value={1}>單面</option>
                  <option value={2}>雙面</option>
                </select>
              </div>
              <div className={`form-group form-group-half field-transition ${getHighlightClass('innerColorCount')}`}>
                <label className="form-label">內頁色數</label>
                <select
                  className="form-select"
                  value={input.innerColorCount}
                  onChange={(event) =>
                    handleChange('innerColorCount', Number(event.target.value))
                  }
                >
                  {[1, 2, 3, 4, 5, 6].map((colorCount) => (
                    <option key={colorCount} value={colorCount}>
                      {colorCount} 色
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="form-card">
        <div className="form-card-header">
          <span className="form-card-number">3</span>
          <h3 className="form-card-title">後加工</h3>
        </div>
        <div className="form-card-body">
          <div className={`form-group field-transition ${getHighlightClass('selectedFinishing')}`}>
            <div className="form-checkbox-list">
              {finishingOptions.map((option) => {
                const checked = (input.selectedFinishing || []).includes(option);
                return (
                  <label key={option} className="form-checkbox-label">
                    <input
                      type="checkbox"
                      className="form-checkbox-input"
                      checked={checked}
                      onChange={(event) => {
                        const current = input.selectedFinishing || [];
                        const next = event.target.checked
                          ? [...current, option]
                          : current.filter((item) => item !== option);
                        handleChange('selectedFinishing', next);
                      }}
                    />
                    <span className="checkbox-custom-label">{option}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="form-card">
        <div className="form-card-header">
          <span className="form-card-number">4</span>
          <h3 className="form-card-title">裝訂</h3>
        </div>
        <div className="form-card-body">
          <div className={`form-group field-transition ${getHighlightClass('bindingType')}`}>
            <label className="form-label">裝訂方式</label>
            <select
              className="form-select"
              value={input.bindingType}
              onChange={(event) => handleChange('bindingType', event.target.value)}
            >
              {bindingOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
