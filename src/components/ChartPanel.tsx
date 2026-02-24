/** UI개발정의서 §5 – 캔들, RSI, 엘리어트 파동(5파동/ABC/ABCDE), 피보나치 되돌림. 트레이딩뷰 스타일 레이아웃 */
import { useRef, useEffect, useState, useCallback } from 'react'
import { createChart, type IChartApi, type IPriceLine } from 'lightweight-charts'
import { Camera, ToggleLeft, MessageSquare, Minus, Trash2, ExternalLink, MousePointer2 } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import type { Timeframe } from '@/types/app'
import { calcRSI, fibPrices } from '@/utils/indicators'
import './ChartPanel.css'

type KlineRow = { time: number; open: number; high: number; low: number; close: number; volume: number }

/** 타임프레임별 1년치 봉 개수 (대략) */
const CANDLES_PER_YEAR: Record<Timeframe, number> = {
  '1m': 365 * 24 * 60,
  '5m': 365 * 24 * 12,
  '15m': 365 * 24 * 4,
  '30m': 365 * 24 * 2,
  '1H': 365 * 24,
  '4H': 365 * 6,
  '1D': 365,
  '1W': 52,
}

type LimitOption = number | '1Y'
const LIMIT_OPTIONS: LimitOption[] = [300, 500, 1000, '1Y']
const TIMEFRAME_OPTIONS: Timeframe[] = ['1m', '5m', '15m', '30m', '1H', '4H', '1D', '1W']
const RSI_PERIOD = 14
const RSI_PANE_HEIGHT = 100

type DrawMode = 'none' | 'horizontal' | '5wave' | 'abc' | 'abcde' | 'fib'

const WAVE_LABELS: Record<DrawMode, string[] | null> = {
  none: null,
  horizontal: null,
  '5wave': ['1', '2', '3', '4', '5'],
  abc: ['A', 'B', 'C'],
  abcde: ['A', 'B', 'C', 'D', 'E'],
  fib: null,
}

const WAVE_POINTS_REQUIRED: Record<DrawMode, number> = {
  none: 0,
  horizontal: 0,
  '5wave': 5,
  abc: 3,
  abcde: 5,
  fib: 2,
}

async function fetchKlines(symbol: string, interval: string, limit: number): Promise<KlineRow[]> {
  const params = new URLSearchParams({ symbol, interval, limit: String(limit) })
  const res = await fetch(`/api/market/klines?${params}`)
  if (!res.ok) throw new Error('차트 데이터 로드 실패')
  return res.json()
}

export function ChartPanel() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const mainWrapRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<HTMLDivElement>(null)
  const rsiChartRef = useRef<HTMLDivElement>(null)

  const chartApi = useRef<IChartApi | null>(null)
  const rsiChartApi = useRef<IChartApi | null>(null)
  const candleSeriesRef = useRef<ReturnType<IChartApi['addCandlestickSeries']> | null>(null)
  const priceLinesRef = useRef<IPriceLine[]>([])
  const waveSeriesRef = useRef<ReturnType<IChartApi['addLineSeries']>[]>([])

  const { symbol, timeframe, setTimeframe } = useAppStore()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [limit, setLimit] = useState<LimitOption>(1000)
  const resolvedLimit = limit === '1Y' ? CANDLES_PER_YEAR[timeframe] : limit
  const [drawMode, setDrawMode] = useState<DrawMode>('none')
  const [wavePoints, setWavePoints] = useState<{ time: number; value: number }[]>([])
  const [lastCandle, setLastCandle] = useState<{ close: number; open: number; high: number; low: number; prevClose?: number } | null>(null)

  const mapTimeframe = useCallback(() => {
    const t = timeframe
    if (t === '1H') return '1h'
    if (t === '4H') return '4h'
    if (t === '1D') return '1d'
    if (t === '1W') return '1w'
    return t
  }, [timeframe])

  const changePercent = lastCandle?.prevClose != null
    ? ((lastCandle.close - lastCandle.prevClose) / lastCandle.prevClose) * 100
    : null

  const removeAllDrawings = useCallback(() => {
    const series = candleSeriesRef.current
    if (series) {
      priceLinesRef.current.forEach((pl) => series.removePriceLine(pl))
      priceLinesRef.current = []
    }
    waveSeriesRef.current.forEach((s) => chartApi.current?.removeSeries(s))
    waveSeriesRef.current = []
    setWavePoints([])
  }, [])

  const addPriceLine = useCallback((price: number, title?: string, color?: string) => {
    const series = candleSeriesRef.current
    if (!series) return
    const line = series.createPriceLine({
      price,
      color: color ?? '#f59e0b',
      lineWidth: 1,
      lineStyle: 2,
      axisLabelVisible: true,
      title: title ?? `${price.toLocaleString()}`,
    })
    priceLinesRef.current.push(line)
  }, [])

  const drawWaveLines = useCallback(
    (points: { time: number; value: number }[], labels: string[]) => {
      if (!chartApi.current || points.length === 0) return
      const line = chartApi.current.addLineSeries({
        color: '#a855f7',
        lineWidth: 2,
        priceLineVisible: false,
        lastValueVisible: false,
      })
      line.setData(points)
      line.setMarkers(
        points.map((p, i) => ({
          time: p.time,
          position: 'belowBar' as const,
          shape: 'circle' as const,
          color: '#a855f7',
          text: labels[i] ?? '',
        }))
      )
      waveSeriesRef.current.push(line)
    },
    []
  )

  useEffect(() => {
    let cancelled = false
    const interval = mapTimeframe()

    setLoading(true)
    setError(null)
    removeAllDrawings()

    fetchKlines(symbol, interval, resolvedLimit)
      .then((rows) => {
        if (cancelled || !chartRef.current || !mainWrapRef.current || !wrapRef.current) return
        chartApi.current?.remove()
        chartApi.current = null
        rsiChartApi.current?.remove()
        rsiChartApi.current = null
        candleSeriesRef.current = null
        priceLinesRef.current = []
        waveSeriesRef.current = []

        const totalH = wrapRef.current.clientHeight
        const mainH = Math.max(350, totalH - RSI_PANE_HEIGHT)
        const w = chartRef.current.clientWidth

        const chart = createChart(chartRef.current, {
          layout: { background: { color: '#1a2332' }, textColor: '#94a3b8' },
          grid: { vertLines: { color: '#2d3a4d' }, horzLines: { color: '#2d3a4d' } },
          width: w,
          height: mainH,
          timeScale: { timeVisible: true, secondsVisible: false },
          rightPriceScale: { borderColor: '#2d3a4d', scaleMargins: { top: 0.1, bottom: 0.2 } },
        })

        const candle = chart.addCandlestickSeries({ upColor: '#22c55e', downColor: '#ef4444', borderVisible: false })
        candleSeriesRef.current = candle

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

        if (rows.length > 0) {
          const last = rows[rows.length - 1]
          const prev = rows.length > 1 ? rows[rows.length - 2] : undefined
          setLastCandle({
            open: last.open,
            high: last.high,
            low: last.low,
            close: last.close,
            prevClose: prev?.close,
          })
        } else {
          setLastCandle(null)
        }

        if (rsiChartRef.current && rows.length > 0) {
          const closes = rows.map((r) => r.close)
          const rsiValues = calcRSI(closes, RSI_PERIOD)
          const rsiData = rows
            .map((r, i) => (rsiValues[i] != null ? { time: r.time, value: rsiValues[i] as number } : null))
            .filter((x): x is { time: number; value: number } => x != null)

          const rsiChart = createChart(rsiChartRef.current, {
            layout: { background: { color: '#1a2332' }, textColor: '#94a3b8' },
            grid: { vertLines: { color: '#2d3a4d' }, horzLines: { color: '#2d3a4d' } },
            width: w,
            height: RSI_PANE_HEIGHT,
            timeScale: { visible: true, timeVisible: true, secondsVisible: false, borderVisible: false },
            rightPriceScale: {
              borderColor: '#2d3a4d',
              scaleMargins: { top: 0.1, bottom: 0.1 },
              autoScale: true,
            },
          })
          const rsiLine = rsiChart.addLineSeries({
            color: '#06b6d4',
            lineWidth: 2,
            priceLineVisible: false,
            lastValueVisible: true,
          })
          rsiLine.setData(rsiData)
          rsiChart.priceScale('right').applyOptions({ scaleMargins: { top: 0.1, bottom: 0.1 } })
          rsiChart.timeScale().fitContent()
          rsiChartApi.current = rsiChart
          chart.timeScale().subscribeVisibleTimeRangeChange(() => {
            const range = chart.timeScale().getVisibleRange()
            if (range && rsiChartApi.current) rsiChartApi.current.timeScale().setVisibleRange(range)
          })
        }

        const handleResize = () => {
          if (!wrapRef.current || !chartRef.current || !chartApi.current) return
          const tw = chartRef.current.clientWidth
          const th = wrapRef.current.clientHeight
          const mh = Math.max(350, th - RSI_PANE_HEIGHT)
          chartApi.current.applyOptions({ width: tw, height: mh })
          if (rsiChartApi.current && rsiChartRef.current) {
            rsiChartApi.current.applyOptions({ width: rsiChartRef.current.clientWidth, height: RSI_PANE_HEIGHT })
          }
        }
        const ro = new ResizeObserver(handleResize)
        ro.observe(wrapRef.current)
        window.addEventListener('resize', handleResize)

        setLoading(false)

        return () => {
          ro.disconnect()
          window.removeEventListener('resize', handleResize)
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : '차트 로드 실패')
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
      chartApi.current?.remove()
      chartApi.current = null
      rsiChartApi.current?.remove()
      rsiChartApi.current = null
      candleSeriesRef.current = null
      priceLinesRef.current = []
      waveSeriesRef.current = []
    }
  }, [symbol, timeframe, resolvedLimit, mapTimeframe, removeAllDrawings])

  const getClickTimePrice = useCallback(
    (e: React.MouseEvent<HTMLDivElement>): { time: number; value: number } | null => {
      if (!chartApi.current || !chartRef.current) return null
      const rect = chartRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const time = chartApi.current.timeScale().coordinateToTime(x) as number
      const price = chartApi.current.priceScale('right').coordinateToPrice(y) as number
      if (time == null || price == null || !isFinite(time) || !isFinite(price)) return null
      return { time: Math.round(time), value: price }
    },
    []
  )

  const handleChartClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const pt = getClickTimePrice(e)
    if (!pt) return

    if (drawMode === 'horizontal') {
      addPriceLine(pt.value)
      setDrawMode('none')
      return
    }

    if (drawMode === '5wave' || drawMode === 'abc' || drawMode === 'abcde') {
      const next = [...wavePoints, pt]
      setWavePoints(next)
      if (next.length === WAVE_POINTS_REQUIRED[drawMode]) {
        const labels = WAVE_LABELS[drawMode]!
        drawWaveLines(next, labels)
        setWavePoints([])
        setDrawMode('none')
      }
      return
    }

    if (drawMode === 'fib') {
      const next = [...wavePoints, pt]
      setWavePoints(next)
      if (next.length === 2) {
        const [p1, p2] = next
        const low = Math.min(p1.value, p2.value)
        const high = Math.max(p1.value, p2.value)
        const levels = fibPrices(low, high)
        const labels = ['0%', '23.6%', '38.2%', '50%', '61.8%', '78.6%', '100%']
        levels.forEach((price, i) => {
          addPriceLine(price, labels[i], i === 0 || i === levels.length - 1 ? '#94a3b8' : '#f59e0b')
        })
        setWavePoints([])
        setDrawMode('none')
      }
    }
  }

  const handleAddPriceLineByInput = () => {
    const raw = window.prompt('가격 입력 (가로선)', '')
    if (raw == null) return
    const price = parseFloat(raw.replace(/,/g, ''))
    if (!isNaN(price)) addPriceLine(price)
  }

  const binanceTradeUrl = (() => {
    const s = symbol.replace('USDT', '_USDT').replace('BUSD', '_BUSD')
    return `https://www.binance.com/en/trade/${s}`
  })()

  const drawHint =
    drawMode === 'horizontal'
      ? '차트를 클릭하면 해당 가격에 가로선이 추가됩니다.'
      : drawMode === 'fib'
        ? `클릭 1: 저점, 클릭 2: 고점 → 피보나치 되돌림선 표시 (${wavePoints.length}/2)`
        : drawMode !== 'none'
          ? `차트를 클릭해 파동 점 표시 (${wavePoints.length}/${WAVE_POINTS_REQUIRED[drawMode]})`
          : null

  return (
    <section className="chart-panel">
      <div className="chart-toolbar">
        <span className="scenario-tabs">
          <button type="button" className="active">Scenario A</button>
          <button type="button">Scenario B</button>
        </span>
        <span className="chart-toolbar-center">
          <span className="toolbar-label">봉 수</span>
          {LIMIT_OPTIONS.map((n) => (
            <button
              key={String(n)}
              type="button"
              className={limit === n ? 'active' : ''}
              onClick={() => setLimit(n)}
            >
              {n === '1Y' ? '1년' : n}
            </button>
          ))}
          <span className="toolbar-sep" />
          <span className="toolbar-label">시간</span>
          {TIMEFRAME_OPTIONS.map((tf) => (
            <button
              key={tf}
              type="button"
              className={timeframe === tf ? 'active' : ''}
              onClick={() => setTimeframe(tf)}
              title={tf}
            >
              {tf}
            </button>
          ))}
        </span>
        <div className="chart-toolbar-right">
          <a
            href={binanceTradeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="toolbar-link"
            title="바이낸스에서 보기"
          >
            <ExternalLink size={14} /> 바이낸스
          </a>
          <button type="button" title="Auto Label"><ToggleLeft size={16} /></button>
          <button type="button" title="Snapshot"><Camera size={16} /></button>
          <button type="button" title="채팅"><MessageSquare size={16} /></button>
        </div>
      </div>
      <div className="chart-layout">
        <div className="chart-draw-toolbar" aria-label="작도 도구">
          <button
            type="button"
            className={drawMode === 'none' ? 'active' : ''}
            onClick={() => setDrawMode('none')}
            title="선택"
          >
            <MousePointer2 size={18} />
          </button>
          <button
            type="button"
            className={drawMode === 'horizontal' ? 'active' : ''}
            onClick={() => setDrawMode('horizontal')}
            title="가로선"
          >
            <Minus size={18} />
          </button>
          <button type="button" onClick={handleAddPriceLineByInput} title="가격 입력">
            $
          </button>
          <button
            type="button"
            className={drawMode === '5wave' ? 'active' : ''}
            onClick={() => setDrawMode('5wave')}
            title="5파동"
          >
            5
          </button>
          <button
            type="button"
            className={drawMode === 'abc' ? 'active' : ''}
            onClick={() => setDrawMode('abc')}
            title="ABC"
          >
            ABC
          </button>
          <button
            type="button"
            className={drawMode === 'abcde' ? 'active' : ''}
            onClick={() => setDrawMode('abcde')}
            title="ABCDE"
          >
            E
          </button>
          <button
            type="button"
            className={drawMode === 'fib' ? 'active' : ''}
            onClick={() => setDrawMode('fib')}
            title="피보나치"
          >
            F
          </button>
          <button type="button" onClick={removeAllDrawings} title="지우기">
            <Trash2 size={18} />
          </button>
        </div>
        <div className="chart-content">
          <div ref={wrapRef} className="chart-container-wrap" onClick={handleChartClick} role="presentation">
            {(loading || error) && (
              <div className="chart-overlay">
                {loading && <p>바이낸스 데이터 로딩 중… ({limit}봉)</p>}
                {error && (
                  <>
                    <p>차트 로드 실패</p>
                    <p className="muted">{error}</p>
                  </>
                )}
              </div>
            )}
            {!loading && !error && lastCandle && (
              <div className="chart-title-overlay">
                <div className="chart-title-row">
                  <span className="chart-title-symbol">{symbol}</span>
                  <span className="chart-title-meta"> · {timeframe} · INDEX</span>
                </div>
                <div className="chart-title-price">
                  <span className="chart-price">{lastCandle.close.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  {changePercent != null && (
                    <span className={changePercent >= 0 ? 'chart-change up' : 'chart-change down'}>
                      {changePercent >= 0 ? '+' : ''}{changePercent.toFixed(2)}%
                    </span>
                  )}
                </div>
              </div>
            )}
            {drawHint && <div className="chart-draw-hint">{drawHint}</div>}
            <div ref={mainWrapRef} className="chart-main-wrap">
              <div ref={chartRef} className="chart-container" />
            </div>
            <div className="chart-rsi-wrap">
              <span className="rsi-label">RSI(14)</span>
              <div ref={rsiChartRef} className="chart-rsi" />
            </div>
          </div>
        </div>
      </div>
      <div className="chart-legend">
        <span>Primary</span>
        <span>Alternative</span>
        <span className="inv">Invalidation</span>
        <span>5파동 / ABC / ABCDE · 피보나치</span>
      </div>
    </section>
  )
}
