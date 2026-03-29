import { useEffect, useRef, useState } from 'react';
import './ChatPanel.css';

function detectIntent(value) {
  const normalized = value.toLowerCase();

  if (normalized.includes('why') || normalized.includes('how')) {
    return 'why';
  }

  if (normalized.includes('risk') || normalized.includes('concern')) {
    return 'risk';
  }

  if (
    normalized.includes('shap') ||
    normalized.includes('driver') ||
    normalized.includes('explain')
  ) {
    return 'shap';
  }

  if (
    normalized.includes('confidence') ||
    normalized.includes('interval') ||
    normalized.includes('certain')
  ) {
    return 'confidence';
  }

  if (
    normalized.includes('auc') ||
    normalized.includes('accurate') ||
    normalized.includes('model')
  ) {
    return 'auc';
  }

  return 'default';
}

function ChatPanel({ stockData, ticker }) {
  const [value, setValue] = useState('');
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef(null);

  const defaultReply = `${ticker} is currently scoring ${stockData.score} with a ${stockData.verdict.toLowerCase()} read. Ask about the drivers, risks, confidence interval, or model quality and I’ll stay inside the current analysis context.`;

  useEffect(() => {
    setMessages([
      { role: 'system', text: `Context loaded · ${ticker}` },
      { role: 'assistant', text: stockData.chatInit },
    ]);
    setValue('');
  }, [stockData, ticker]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!value.trim()) {
      return;
    }

    const nextValue = value.trim();
    const intent = detectIntent(nextValue);

    setMessages((current) => [
      ...current,
      { role: 'user', text: nextValue },
      {
        role: 'assistant',
        text: intent === 'default' ? defaultReply : stockData.responses[intent],
      },
    ]);
    setValue('');
  };

  return (
    <div className="chat-panel">
      <div className="chat-panel-header">
        <div className="chat-panel-header-left">
          <span className="status-dot" aria-hidden="true" />
          <span className="chat-panel-title">EquityIQ Assistant</span>
        </div>
        <div className="chat-panel-context">Claude-powered · Context-aware</div>
      </div>

      <div className="chat-panel-messages" ref={scrollRef}>
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={`chat-message ${message.role}`}
          >
            {message.text}
          </div>
        ))}
      </div>

      <form className="chat-panel-input-row" onSubmit={handleSubmit}>
        <input
          className="chat-panel-input"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Ask about this analysis..."
          autoComplete="off"
        />
        <button className="chat-panel-send" type="submit">
          Send
        </button>
      </form>
    </div>
  );
}

export default ChatPanel;
