/** UI개발정의서 §7.1 Order Entry – Side, Order Type, Quantity, Entry, SL, TP, Risk %, Auto Size, Preview / Place Order / Arm Strategy */
import { useState } from 'react'
import { useAppStore } from '@/store/useAppStore'

export function OrderEntry() {
  const { ui } = useAppStore()
  const [side, setSide] = useState<'Long' | 'Short'>('Long')
  const [orderType, setOrderType] = useState<'Market' | 'Limit' | 'Stop'>('Market')
  const [qty, setQty] = useState('')
  const [entry, setEntry] = useState('')
  const [sl, setSl] = useState('')
  const [tp, setTp] = useState('')
  const [riskPct, setRiskPct] = useState('1')

  const canOrder = ui.brokerConnected

  return (
    <div className="order-entry">
      <div className="order-row">
        <label>Side</label>
        <div className="btn-group">
          <button type="button" className={side === 'Long' ? 'active' : ''} onClick={() => setSide('Long')}>Long</button>
          <button type="button" className={side === 'Short' ? 'active' : ''} onClick={() => setSide('Short')}>Short</button>
        </div>
      </div>
      <div className="order-row">
        <label>Order Type</label>
        <select value={orderType} onChange={(e) => setOrderType(e.target.value as 'Market' | 'Limit' | 'Stop')}>
          <option value="Market">Market</option>
          <option value="Limit">Limit</option>
          <option value="Stop">Stop</option>
        </select>
      </div>
      <div className="order-row">
        <label>Quantity</label>
        <input type="number" value={qty} onChange={(e) => setQty(e.target.value)} placeholder="수량" />
      </div>
      <div className="order-row">
        <label>Entry Price</label>
        <input type="number" value={entry} onChange={(e) => setEntry(e.target.value)} placeholder="지정가" />
      </div>
      <div className="order-row">
        <label>Stop Loss</label>
        <input type="number" value={sl} onChange={(e) => setSl(e.target.value)} placeholder="무효화 연동" />
      </div>
      <div className="order-row">
        <label>Take Profit</label>
        <input type="number" value={tp} onChange={(e) => setTp(e.target.value)} placeholder="분할 설정" />
      </div>
      <div className="order-row">
        <label>Risk %</label>
        <input type="number" value={riskPct} onChange={(e) => setRiskPct(e.target.value)} /> <span>Auto Size (ATR)</span>
      </div>
      <div className="order-actions">
        <button type="button">Preview</button>
        <button type="button" disabled={!canOrder}>Place Order</button>
        <button type="button" disabled={!canOrder}>Arm Strategy</button>
      </div>
    </div>
  )
}
