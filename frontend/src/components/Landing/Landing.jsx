import { useEffect, useRef, useState } from 'react';
import HeroScene from './HeroScene.jsx';
import MarketStrip from './MarketStrip.jsx';
import TickerTape from './TickerTape.jsx';
import './Landing.css';

function formatClock(date) {
  return `${date.toLocaleTimeString('en-US', {
    timeZone: 'America/New_York',
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })} EST`;
}

function Landing({ active, ticker, onSearch }) {
  const [value, setValue] = useState('');
  const [clock, setClock] = useState(() => new Date());
  const inputRef = useRef(null);

  useEffect(() => {
    const interval = window.setInterval(() => setClock(new Date()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    let timeoutId;
    if (active) {
      timeoutId = window.setTimeout(() => {
        inputRef.current?.focus();
      }, 120);
    }

    return () => window.clearTimeout(timeoutId);
  }, [active]);

  const submitSearch = (event) => {
    event.preventDefault();
    if (!value.trim()) {
      return;
    }

    onSearch(value);
    setValue('');
  };

  return (
    <section className={`landing-screen ${active ? 'is-active' : 'is-hidden'}`}>
      <div className="landing-hero">
        <HeroScene active={active} ticker={ticker} />
      </div>

      <div className="landing-ui">
        <header className="landing-topbar">
          <div className="landing-logo" aria-label="EquityIQ">
            <span className="landing-logo-equity">EQUITY</span>
            <span className="landing-logo-iq">IQ</span>
          </div>

          <div className="landing-market-status">
            <span className="status-dot" aria-hidden="true" />
            <span className="landing-market-open">MARKETS OPEN</span>
            <span className="landing-market-venues">NYSE · NASDAQ · CBOE</span>
          </div>

          <div className="landing-clock">{formatClock(clock)}</div>
        </header>

        <div className="landing-center">
          <div className="landing-copy">
            <div className="landing-eyebrow">INSTITUTIONAL-GRADE EQUITY ANALYSIS</div>
            <div className="landing-headline-row">
              <span className="landing-sigil" aria-hidden="true" />
              <h1 className="landing-headline">
                <span>SEE THE</span>
                <span className="landing-headline-accent">SIGNAL</span>
              </h1>
            </div>
            <div className="landing-subline">Free · Open Source · ML-Powered</div>
          </div>

          <form className="landing-command" onSubmit={submitSearch}>
            <label className="landing-command-line" htmlFor="landing-ticker">
              <span className="landing-command-prefix">→</span>
              <input
                id="landing-ticker"
                ref={inputRef}
                value={value}
                onChange={(event) => setValue(event.target.value.toUpperCase())}
                className="landing-command-input"
                type="text"
                placeholder="ENTER TICKER SYMBOL"
                autoComplete="off"
                spellCheck="false"
                maxLength={8}
              />
            </label>
            <div className="landing-command-hint">
              Press Enter · Try AAPL · MSFT · NVDA
            </div>
          </form>

          <MarketStrip />
        </div>
      </div>

      <TickerTape />
    </section>
  );
}

export default Landing;
