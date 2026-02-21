/** UI개발정의서 §7.3 Logs – 전략 실행, 주문 체결, 시스템 에러, 경제지표 알림 */
const MOCK_LOGS = [
  { time: '10:00:01', level: 'info', msg: 'Wave Engine 재실행 완료 (1H)' },
  { time: '10:00:02', level: 'order', msg: 'Preview: Long 0.01 BTC @ 67200' },
  { time: '10:05:00', level: 'econ', msg: 'High Impact 30분 전 – CPI' },
]

export function Logs() {
  return (
    <div className="logs-panel">
      <div className="logs-list">
        {MOCK_LOGS.map((log, i) => (
          <div key={i} className={`log-line log-${log.level}`}>
            <span className="log-time">{log.time}</span>
            <span className="log-msg">{log.msg}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
