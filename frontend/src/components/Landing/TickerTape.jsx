import { TICKER_TAPE } from '../../constants/mockData.js';

function TapeRow() {
  return (
    <>
      {TICKER_TAPE.map((item) => (
        <span className="ticker-tape-item" key={`${item.symbol}-${item.price}`}>
          <span className="ticker-tape-symbol">{item.symbol}</span>
          <span className="ticker-tape-price">{item.price}</span>
          <span className={`ticker-tape-change ${item.up ? 'up' : 'down'}`}>
            {item.change}
          </span>
        </span>
      ))}
    </>
  );
}

function TickerTape() {
  return (
    <div className="ticker-tape" aria-hidden="true">
      <div className="ticker-tape-track">
        <TapeRow />
        <TapeRow />
      </div>
    </div>
  );
}

export default TickerTape;
