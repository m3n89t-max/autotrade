/** UI개발정의서 §4 Left Sidebar – Watchlist: Symbol, Last, Change %, Volume, Wave, Trigger */
import { useAppStore } from '@/store/useAppStore'
import './LeftSidebar.css'

const waveColor: Record<string, string> = {
  Impulse: 'var(--color-confirmed)',
  Corrective: 'var(--color-warning)',
  Unclear: 'var(--color-neutral)',
}

export function LeftSidebar() {
  const { watchlist, symbol, setSymbol } = useAppStore()

  return (
    <aside className="left-sidebar">
      <h2 className="panel-title">Watchlist</h2>
      <div className="watchlist-table-wrap">
        <table className="watchlist-table">
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Last</th>
              <th>Chg%</th>
              <th>Vol</th>
              <th>Wave</th>
              <th>Trigger</th>
            </tr>
          </thead>
          <tbody>
            {watchlist.map((row) => (
              <tr
                key={row.symbol}
                className={row.symbol === symbol ? 'active' : ''}
                onClick={() => setSymbol(row.symbol)}
                onContextMenu={(e) => {
                  e.preventDefault()
                  // 우클릭: 삭제/고정/알림 설정 (추후 메뉴)
                }}
              >
                <td className="sym">{row.symbol}</td>
                <td>{row.last.toLocaleString()}</td>
                <td className={row.changePercent >= 0 ? 'up' : 'down'}>
                  {row.changePercent >= 0 ? '+' : ''}{row.changePercent}%
                </td>
                <td>{(row.volume / 1e6).toFixed(1)}M</td>
                <td style={{ color: waveColor[row.wave] }}>{row.wave}</td>
                <td>{row.trigger}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </aside>
  )
}
