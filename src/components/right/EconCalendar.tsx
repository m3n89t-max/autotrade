/** UI개발정의서 §6.3 US Economic Calendar – Time(ET), Event, Impact, Forecast, Actual, Previous, Surprise, 카운트다운 */
import { useAppStore } from '@/store/useAppStore'

const MOCK_EVENTS = [
  { id: '1', timeET: '09:30', event: 'CPI m/m', impact: 'High' as const, forecast: '0.3%', actual: null, previous: '0.2%', surprise: null, countdownMinutes: 125 },
  { id: '2', timeET: '14:00', event: 'FOMC Statement', impact: 'High' as const, forecast: '-', actual: null, previous: '-', surprise: null, countdownMinutes: 330 },
]

export function EconCalendar() {
  const { econ } = useAppStore()

  const events = econ.events.length > 0 ? econ.events : MOCK_EVENTS

  return (
    <div className="econ-calendar">
      <div className="econ-filters">
        <span>날짜</span>
        <select><option>오늘</option></select>
        <span>Impact</span>
        <select><option>High</option><option>Medium</option><option>Low</option></select>
        <span>유형</span>
        <select><option>전체</option><option>CPI</option><option>FOMC</option><option>NFP</option><option>GDP</option></select>
      </div>
      <div className="econ-blackout-settings">
        <small>차단: 발표 전 N분 · 발표 후 M분</small>
      </div>
      <table className="econ-table">
        <thead>
          <tr>
            <th>Time (ET)</th>
            <th>Event</th>
            <th>Impact</th>
            <th>Forecast</th>
            <th>Actual</th>
            <th>Previous</th>
            <th>Surprise</th>
          </tr>
        </thead>
        <tbody>
          {events.map((ev) => (
            <tr key={ev.id} className={`impact-${ev.impact.toLowerCase()}`}>
              <td>{ev.timeET}</td>
              <td>{ev.event}</td>
              <td>{ev.impact}</td>
              <td>{ev.forecast ?? '-'}</td>
              <td>{ev.actual ?? '-'}</td>
              <td>{ev.previous ?? '-'}</td>
              <td>{ev.surprise != null ? ev.surprise : (ev.countdownMinutes != null ? `−${ev.countdownMinutes}m` : '-')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
