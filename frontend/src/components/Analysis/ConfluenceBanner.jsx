function bannerTone(type, score) {
  if (type === 'strong' || score <= 35) {
    return {
      tone: 'is-strong',
      label: 'Strong Opportunity',
      dot: 'status-dot strong',
    };
  }

  if (type === 'caution' || score >= 65) {
    return {
      tone: 'is-caution',
      label: 'Caution',
      dot: 'status-dot caution',
    };
  }

  return {
    tone: 'is-neutral',
    label: 'Neutral',
    dot: 'status-dot neutral',
  };
}

function ConfluenceBanner({ stockData }) {
  const { tone, label, dot } = bannerTone(stockData.confluenceType, stockData.score);
  const [lo, , hi] = stockData.ci;

  return (
    <div className={`confluence-banner ${tone}`}>
      <div className="confluence-banner-left">
        <div className="confluence-pill">
          <span className={dot} aria-hidden="true" />
          <span>{label}</span>
        </div>
        <div className="confluence-description">{stockData.confluenceDesc}</div>
      </div>
      <div className="confluence-interval">[ {lo} - {hi} ]</div>
    </div>
  );
}

export default ConfluenceBanner;
