import { useEffect, useState } from 'react';
import { FALLBACK_TICKER, STOCKS } from '../constants/mockData.js';

export function useStockData(ticker) {
  const [data, setData] = useState(STOCKS[FALLBACK_TICKER]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const symbol = (ticker || FALLBACK_TICKER).trim().toUpperCase();
    const next = STOCKS[symbol] || STOCKS[FALLBACK_TICKER];

    setLoading(false);
    setError(null);
    setData(next);

    // Replace with real API call when backend is running
    // fetch(`http://localhost:8000/score/${symbol}`)
  }, [ticker]);

  return { data, loading, error };
}
