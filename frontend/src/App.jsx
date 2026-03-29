import { useEffect, useState } from 'react';
import Landing from './components/Landing/Landing.jsx';
import Analysis from './components/Analysis/Analysis.jsx';
import { FALLBACK_TICKER, STOCKS } from './constants/mockData.js';

function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [currentTicker, setCurrentTicker] = useState(FALLBACK_TICKER);
  const [currentData, setCurrentData] = useState(STOCKS[FALLBACK_TICKER]);

  const handleSearch = (ticker) => {
    const symbol = ticker.trim().toUpperCase();
    if (!symbol) {
      return;
    }

    const resolvedTicker = STOCKS[symbol] ? symbol : FALLBACK_TICKER;
    setCurrentTicker(resolvedTicker);
    setCurrentData(STOCKS[resolvedTicker]);
    setCurrentView('analysis');
  };

  const handleGoHome = () => {
    setCurrentView('landing');
  };

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape' && currentView === 'analysis') {
        handleGoHome();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [currentView]);

  return (
    <div className="app-root">
      <Landing
        active={currentView === 'landing'}
        ticker={currentTicker}
        onSearch={handleSearch}
      />
      <Analysis
        active={currentView === 'analysis'}
        stockData={currentData}
        ticker={currentTicker}
        onGoHome={handleGoHome}
        onSearch={handleSearch}
      />
    </div>
  );
}

export default App;
