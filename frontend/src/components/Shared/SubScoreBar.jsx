function toneClass(value) {
  if (value <= 30) {
    return 'tone-positive';
  }

  if (value >= 70) {
    return 'tone-negative';
  }

  return 'tone-neutral';
}

function SubScoreBar({ subScore }) {
  return (
    <div className="subscore-row">
      <div className="subscore-key">{subScore.key}</div>
      <div className="subscore-name">{subScore.name}</div>
      <div className="subscore-track">
        <div
          className={`subscore-fill ${toneClass(subScore.value)}`}
          style={{ width: `${subScore.value}%` }}
        />
      </div>
      <div className="subscore-value">{subScore.value}</div>
    </div>
  );
}

export default SubScoreBar;
