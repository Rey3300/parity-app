import { useEffect, useState } from 'react';

function Topbar({ stockData, ticker, onGoHome, onSearch }) {
  const [searchValue, setSearchValue] = useState(ticker);

  useEffect(() => {
    setSearchValue(ticker);
  }, [ticker]);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(searchValue || ticker);
  };

  return (
    <header className="analysis-topbar">
      <button className="analysis-topbar-logo" type="button" onClick={onGoHome}>
        <span className="analysis-topbar-logo-equity">EQUITY</span>
        <span className="analysis-topbar-logo-iq">IQ</span>
      </button>

      <div className="analysis-topbar-divider" />

      <div className="analysis-topbar-stock">
        <div className="analysis-topbar-stock-line">
          <span className="analysis-topbar-ticker">{ticker}</span>
          <span className="analysis-topbar-price">${stockData.price}</span>
          <span
            className={`analysis-topbar-change ${stockData.up ? 'up' : 'down'}`}
          >
            {stockData.priceChange} ({stockData.priceChangePercent})
          </span>
        </div>
        <div className="analysis-topbar-meta">
          {stockData.name} · {stockData.sector}
        </div>
      </div>

      <nav className="analysis-tabs" aria-label="Analysis tabs">
        <button className="analysis-tab is-active" type="button">
          Fundamental
        </button>
        <button className="analysis-tab is-locked" type="button" tabIndex={-1}>
          Technical <span className="analysis-tab-badge">V1.0</span>
        </button>
        <button className="analysis-tab is-locked" type="button" tabIndex={-1}>
          Supply Chain <span className="analysis-tab-badge">V2.0</span>
        </button>
        <button className="analysis-tab is-locked" type="button" tabIndex={-1}>
          Options <span className="analysis-tab-badge">V2.0</span>
        </button>
      </nav>

      <form className="analysis-topbar-search" onSubmit={handleSubmit}>
        <label className="analysis-topbar-search-shell" htmlFor="analysis-search">
          <span className="analysis-topbar-search-prefix">→</span>
          <input
            id="analysis-search"
            className="analysis-topbar-search-input"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value.toUpperCase())}
            placeholder="TICKER"
            maxLength={8}
            autoComplete="off"
            spellCheck="false"
          />
        </label>
        <button className="analysis-topbar-search-button" type="submit">
          GO
        </button>
      </form>
    </header>
  );
}

export default Topbar;
