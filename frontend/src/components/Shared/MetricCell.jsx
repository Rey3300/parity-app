function MetricCell({ metric }) {
  return (
    <div className="metric-cell">
      <div className="metric-name">{metric.name}</div>
      <div className="metric-value">{metric.value}</div>
      <div className="metric-compare">
        vs <span className={metric.better ? 'metric-better' : 'metric-worse'}>{metric.vsSector}</span>
      </div>
    </div>
  );
}

export default MetricCell;
