export default function BreakdownCard({
  title,
  children,
  badge = '',
  badgeType = 'info',
}) {
  return (
    <div className="breakdown-card">
      <div className="breakdown-card-header">
        <h3 className="breakdown-card-title">{title}</h3>
        {badge && <span className={`badge badge-${badgeType}`}>{badge}</span>}
      </div>
      <div className="breakdown-card-body">{children}</div>
    </div>
  );
}
