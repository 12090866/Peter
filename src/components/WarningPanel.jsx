const labels = {
  error: '錯誤',
  warning: '注意',
  info: '說明',
  notice: '備註',
};

export default function WarningPanel({ warnings = [] }) {
  if (!warnings.length) return null;

  return (
    <div className="warning-panel">
      <h3 className="warning-panel-title">系統提醒</h3>
      <div className="warning-list">
        {warnings.map((warning, index) => (
          <div key={`${warning.type}-${index}`} className={`warning-item warning-${warning.type}`}>
            <span className="warning-icon">{labels[warning.type] || '提醒'}</span>
            <span className="warning-message">{warning.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
