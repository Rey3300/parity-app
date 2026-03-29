import Topbar from './Topbar.jsx';
import ConfluenceBanner from './ConfluenceBanner.jsx';
import ScoreColumn from './ScoreColumn.jsx';
import AnalysisColumn from './AnalysisColumn.jsx';
import FooterBar from './FooterBar.jsx';
import VolSurface from '../Visualizations/VolSurface.jsx';
import ChatPanel from '../Chat/ChatPanel.jsx';
import './Analysis.css';

function Analysis({ active, stockData, ticker, onGoHome, onSearch }) {
  if (!stockData) {
    return null;
  }

  return (
    <section className={`analysis-screen ${active ? 'is-active' : 'is-hidden'}`}>
      <Topbar
        stockData={stockData}
        ticker={ticker}
        onGoHome={onGoHome}
        onSearch={onSearch}
      />

      <ConfluenceBanner stockData={stockData} />

      <div className="analysis-workspace">
        <aside className="analysis-sidebar">
          <button className="analysis-sidebar-button is-active" type="button">
            ≡
          </button>
          <button className="analysis-sidebar-button is-locked" type="button">
            ◎
          </button>
          <button className="analysis-sidebar-button is-locked" type="button">
            ◉
          </button>
          <div className="analysis-sidebar-spacer" />
          <button className="analysis-sidebar-button" type="button">
            ⚙
          </button>
        </aside>

        <div className="analysis-main">
          <div className="analysis-main-columns">
            <ScoreColumn stockData={stockData} ticker={ticker} />
            <AnalysisColumn stockData={stockData} />
          </div>

          <aside className="analysis-right-panel">
            <div className="analysis-vol-panel">
              <VolSurface active={active} stockData={stockData} />
            </div>
            <div className="analysis-chat-panel">
              <ChatPanel stockData={stockData} ticker={ticker} />
            </div>
          </aside>
        </div>
      </div>

      <FooterBar />
    </section>
  );
}

export default Analysis;
