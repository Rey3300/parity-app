import { MODEL_METADATA } from '../../constants/mockData.js';

function FooterBar() {
  const timestamp = new Date().toLocaleString('en-US', {
    timeZone: 'America/New_York',
    month: '2-digit',
    day: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return (
    <footer className="footer-bar">
      <div className="footer-item">
        <span className="footer-key">Model</span>
        <span className="footer-value">{MODEL_METADATA.model}</span>
      </div>
      <div className="footer-item">
        <span className="footer-key">AUC</span>
        <span className="footer-value">{MODEL_METADATA.auc}</span>
      </div>
      <div className="footer-item">
        <span className="footer-key">Updated</span>
        <span className="footer-value">{timestamp} ET</span>
      </div>
      <div className="footer-spacer" />
      <div className="footer-disclaimer">
        Not financial advice · Research-only preview · EquityIQ V0.1
      </div>
    </footer>
  );
}

export default FooterBar;
