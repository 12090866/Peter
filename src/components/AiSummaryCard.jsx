export default function AiSummaryCard({ summary }) {
  if (!summary) return null;

  return (
    <div className="ai-summary-card">
      <div className="ai-summary-header">
        <h3 className="ai-summary-title">估價摘要</h3>
        <span className="badge badge-ai">自動生成</span>
      </div>
      <div className="ai-summary-body">
        <p className="ai-summary-text">{summary}</p>
      </div>
    </div>
  );
}
