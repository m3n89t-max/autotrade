/** UI개발정의서 §3 Top Bar: TB-SYMBOL, TB-EXCHANGE, TB-TF, TB-STRATEGY, TB-ECON, TB-ACCOUNT */
import { Search, Activity, Settings } from 'lucide-react'
import './TopBar.css'
import { useAppStore } from '@/store/useAppStore'
import type { Timeframe } from '@/types/app'

const TIMEFRAMES: Timeframe[] = ['1m', '5m', '15m', '1H', '4H', '1D', '1W']
const EXCHANGES = ['Binance', 'NYSE']

export function TopBar() {
  const {
    symbol,
    timeframe,
    exchange,
    ui: { strategyOn, brokerConnected, wsConnected },
    setSymbol,
    setTimeframe,
    setExchange,
    setStrategyOn,
  } = useAppStore()

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="topbar-item symbol-search" title="TB-SYMBOL">
          <Search size={16} />
          <input
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            placeholder="심볼 검색"
            className="symbol-input"
          />
        </div>
        <div className="topbar-item" title="TB-EXCHANGE">
          <select
            value={exchange}
            onChange={(e) => setExchange(e.target.value)}
            className="exchange-select"
          >
            {EXCHANGES.map((ex) => (
              <option key={ex} value={ex}>{ex}</option>
            ))}
          </select>
        </div>
        <div className="topbar-item" title="TB-TF">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as Timeframe)}
            className="tf-select"
          >
            {TIMEFRAMES.map((tf) => (
              <option key={tf} value={tf}>{tf}</option>
            ))}
          </select>
        </div>
        <div className="topbar-item strategy-toggle" title="TB-STRATEGY">
          <span className="label">Auto</span>
          <button
            type="button"
            className={`toggle ${strategyOn ? 'on' : ''}`}
            onClick={() => setStrategyOn(!strategyOn)}
            disabled={!brokerConnected}
            title={!brokerConnected ? '브로커 연결 후 사용' : ''}
          >
            <span className="knob" />
          </button>
        </div>
        <div className="topbar-item econ-countdown" title="TB-ECON">
          <Activity size={14} />
          <span>High Impact: --:--</span>
        </div>
      </div>
      <div className="topbar-right">
        {(!wsConnected || !brokerConnected) && (
          <span className="warning-banner">연결 끊김</span>
        )}
        <div className="topbar-item account" title="TB-ACCOUNT">
          <Settings size={16} />
          <span>계정</span>
        </div>
      </div>
    </header>
  )
}
