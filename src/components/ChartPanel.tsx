/** UI개발정의서 §5 Center – 실시간 차트, 파동 오버레이. 바이낸스 K线 API 연동 */
import { useRef, useEffect, useState } from 'react'
import { createChart, type IChartApi } from 'lightweight-charts'
import { Camera, ToggleLeft, MessageSquare } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import './ChartPanel.css'

type KlineRow = { time: number; open: number; high: number; low: number; close: number; volume: number }

async function fetchKlines(symbol: string, interval: string): Promise<KlineRow[]> {
  const params = new URLSearchParams({ symbol, interval, limit: '500' })
  const res = await fetch(`/api/market/klines?${params}`)
  if (!res.ok) throw new Error('차트 데이터 로드 실패')
  return res.json()
}

export function ChartPanel() {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartApi = useRef<IChartApi | null>(null)
  const { symbol, timeframe } = useAppStore()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const interval = timeframe === '1H' ? '1h' : timeframe === '4H' ? '4h' : timeframe === '1D' ? '1d' : timeframe === '1W' ? '1w' : timeframe

    setLoading(true)
    setError(null)
    fetchKlines(symbol, interval)
      .then((rows) => {
        if (cancelled || !chartRef.current) return
        chartApi.current?.remove()
        chartApi.current = null
        const chart = createChart(chartRef.current, {
          layout: { background: { color: '#1a2332' }, textColor: '#94a3b8' },
          grid: { vertLines: { color: '#2d3a4d' }, horzLines: { color: '#2d3a4d' } },
          width: chartRef.current.clientWidth,
          height: 360,
          timeScale: { timeVisible: true, secondsVisible: false },
          rightPriceScale: { borderColor: '#2d3a4d' },
        })
        const candle = chart.addCandlestickSeries({ upColor: '#22c55e', downColor: '#ef4444', borderVisible: false })
        const vol = chart.addHistogramSeries({ priceFormat: { type: 'volume' } })
        candle.setData(rows.map((r) => ({ time: r.time, open: r.open, high: r.high, low: r.low, close: r.close })))
        vol.setData(
          rows.map((r) => ({
            time: r.time,
            value: r.volume,
            color: r.close >= r.open ? '#22c55e' : '#ef4444',
          }))
        )
        chart.timeScale().fitContent()
        chartApi.current = chart
        setLoading(false)
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : '차트 로드 실패')
          setLoading(false)
        }
      })

    const onResize = () => chartApi.current?.applyOptions({ width: chartRef.current?.clientWidth ?? 0 })
    window.addEventListener('resize', onResize)
    return () => {
      cancelled = true
      window.removeEventListener('resize', onResize)
      chartApi.current?.remove()
      chartApi.current = null
    }
  }, [symbol, timeframe])

  return (
    <section className="chart-panel">
      <div className="chart-toolbar">
        <span className="scenario-tabs">
          <button type="button" className="active">Scenario A</button>
          <button type="button">Scenario B</button>
        </span>
        <div className="chart-toolbar-right">
          <button type="button" title="Auto Label ON/OFF"><ToggleLeft size={16} /> Auto Label</button>
          <button type="button" title="Snapshot to Chat"><Camera size={16} /> Snapshot</button>
          <button type="button" title="채팅에 보내기"><MessageSquare size={16} /></button>
        </div>
      </div>
      <div className="chart-container-wrap">
        {(loading || error) && (
          <div className="chart-overlay">
            {loading && <p>바이낸스 데이터 로딩 중…</p>}
            {error && (
              <>
                <p>차트 로드 실패</p>
                <p className="muted">{error}</p>
                <p className="muted">백엔드 서버 실행 여부·심볼({symbol}) 확인하세요.</p>
              </>
            )}
          </div>
        )}
        <div ref={chartRef} className="chart-container" />
      </div>
      <div className="chart-legend">
        <span>Primary Scenario</span>
        <span>Alternative Scenario</span>
        <span className="inv">Invalidation Line</span>
        <span>Trigger Zone · TP1 / TP2</span>
      </div>
    </section>
  )
}
