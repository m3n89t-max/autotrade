/** UI개발정의서 §7.2 Positions – Symbol, Entry, Size, PnL, SL, TP */
import { useAppStore } from '@/store/useAppStore'

export function Positions() {
  const { orders } = useAppStore()
  const positions = orders.positions

  if (positions.length === 0) {
    return (
      <div className="positions-empty">
        <p>오픈 포지션 없음</p>
      </div>
    )
  }

  return (
    <div className="positions-table-wrap">
      <table className="positions-table">
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Entry</th>
            <th>Size</th>
            <th>PnL</th>
            <th>SL</th>
            <th>TP</th>
          </tr>
        </thead>
        <tbody>
          {positions.map((pos, i) => (
            <tr key={`${pos.symbol}-${i}`}>
              <td>{pos.symbol}</td>
              <td>{pos.entry}</td>
              <td>{pos.size}</td>
              <td className={pos.pnl >= 0 ? 'up' : 'down'}>{pos.pnl >= 0 ? '+' : ''}{pos.pnl}</td>
              <td>{pos.sl ?? '-'}</td>
              <td>{pos.tp ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
