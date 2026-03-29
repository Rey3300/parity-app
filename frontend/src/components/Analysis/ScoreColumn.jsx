import { MODEL_METADATA } from '../../constants/mockData.js';
import SubScoreBar from '../Shared/SubScoreBar.jsx';

function scoreToneClass(score) {
  if (score <= 30) {
    return 'score-positive';
  }

  if (score >= 70) {
    return 'score-negative';
  }

  return 'score-neutral';
}

function ScoreColumn({ stockData, ticker }) {
  const [lo, mid, hi] = stockData.ci;
  const rangeLeft = `${lo}%`;
  const rangeWidth = `${hi - lo}%`;
  const pinLeft = `${mid}%`;

  return (
    <aside className="score-column">
      <section className="score-column-section">
        <div className="score-column-label">Fundamental Score · V0.1</div>
        <div
          className={`score-column-value ${scoreToneClass(stockData.score)}`}
          key={ticker}
        >
          {stockData.score}
        </div>
        <div className="score-column-verdict">{stockData.verdict}</div>
      </section>

      <div className="analysis-divider" />

      <section className="score-column-section">
        <div className="score-column-label">Sub-Score Breakdown</div>
        <div className="score-column-bars">
          {stockData.subs.map((subScore) => (
            <SubScoreBar key={subScore.key} subScore={subScore} />
          ))}
        </div>
      </section>

      <div className="analysis-divider" />

      <section className="score-column-section">
        <div className="score-column-label">Confidence Interval · MAPIE</div>
        <div className="confidence-interval">
          <div className="confidence-interval-scale">
            <span className="confidence-interval-bound">{lo}</span>
            <div className="confidence-interval-track">
              <div
                className="confidence-interval-range"
                style={{ left: rangeLeft, width: rangeWidth }}
              />
              <div className="confidence-interval-pin" style={{ left: pinLeft }} />
            </div>
            <span className="confidence-interval-bound">{hi}</span>
          </div>
          <div className="confidence-interval-label">{stockData.ciLabel}</div>
        </div>
      </section>

      <div className="analysis-divider" />

      <section className="score-column-section">
        <div className="score-column-metadata">
          <div className="metadata-row">
            <span className="metadata-key">Model</span>
            <span className="metadata-value">{MODEL_METADATA.model}</span>
          </div>
          <div className="metadata-row">
            <span className="metadata-key">Test AUC</span>
            <span className="metadata-value">{MODEL_METADATA.auc}</span>
          </div>
          <div className="metadata-row">
            <span className="metadata-key">Training</span>
            <span className="metadata-value">{MODEL_METADATA.training}</span>
          </div>
          <div className="metadata-row">
            <span className="metadata-key">Stocks</span>
            <span className="metadata-value">{MODEL_METADATA.stocks}</span>
          </div>
        </div>
      </section>
    </aside>
  );
}

export default ScoreColumn;
