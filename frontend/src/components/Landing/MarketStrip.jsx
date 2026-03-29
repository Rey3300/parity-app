import { MARKET_STRIP } from '../../constants/mockData.js';

function MarketStrip() {
  return (
    <div className="market-strip" aria-label="Market strip">
      {MARKET_STRIP.map((item) => (
        <div className="market-strip-box" key={item.symbol}>
          <div className="market-strip-symbol">{item.symbol}</div>
          <div className="market-strip-value">{item.value}</div>
          <div className={`market-strip-change ${item.up ? 'up' : 'down'}`}>
            {item.change}
          </div>
        </div>
      ))}
    </div>
  );
}

export default MarketStrip;
