function ShapRow({ item, maxValue }) {
  const ratio = `${(item.rawValue / maxValue) * 100}%`;

  return (
    <div className="shap-row">
      <div className="shap-feature">{item.feature}</div>
      <div className="shap-bar-track">
        <div
          className={`shap-bar-fill ${item.positive ? 'positive' : 'negative'}`}
          style={{ width: ratio }}
        />
      </div>
      <div className={`shap-value ${item.positive ? 'positive' : 'negative'}`}>
        {item.value}
      </div>
      <div className={`shap-arrow ${item.positive ? 'positive' : 'negative'}`}>
        {item.positive ? '↑' : '↓'}
      </div>
    </div>
  );
}

export default ShapRow;
