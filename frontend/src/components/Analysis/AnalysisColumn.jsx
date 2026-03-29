import ShapRow from '../Shared/ShapRow.jsx';
import MetricCell from '../Shared/MetricCell.jsx';

function AnalysisColumn({ stockData }) {
  const maxShap = Math.max(...stockData.shap.map((item) => item.rawValue));

  return (
    <section className="analysis-column">
      <div className="analysis-section-header">
        <span>SHAP Attribution</span>
        <div className="analysis-section-line" />
        <span>Top Drivers</span>
      </div>

      <div className="analysis-shap-list">
        {stockData.shap.map((item) => (
          <ShapRow key={item.feature} item={item} maxValue={maxShap} />
        ))}
      </div>

      <div className="analysis-section-header metrics-header">
        <span>Key Metrics</span>
        <div className="analysis-section-line" />
        <span>Vs Sector Median</span>
      </div>

      <div className="analysis-metrics-grid">
        {stockData.metrics.map((metric) => (
          <MetricCell key={metric.name} metric={metric} />
        ))}
      </div>
    </section>
  );
}

export default AnalysisColumn;
