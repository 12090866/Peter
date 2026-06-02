import { formatDate } from '../utils/format';

export default function Header({ debugMode }) {
  return (
    <header className="header">
      <div className="header-left">
        <h1 className="header-title">
          <span className="header-icon">HC</span>
          鴻彩印刷快速報價
        </h1>
        <p className="header-subtitle">
          內部試算工具 · 書籍、型錄與小冊印製成本估算
        </p>
      </div>
      <div className="header-right">
        <span className="badge badge-status">
          <span className="status-dot" />
          計價引擎可用
        </span>
        <span className="header-date">{formatDate()}</span>
        <span className={`badge ${debugMode ? 'badge-debug' : 'badge-simple'}`}>
          {debugMode ? '明細模式' : '簡潔模式'}
        </span>
      </div>
    </header>
  );
}
