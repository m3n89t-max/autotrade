/**
 * TradingView Charting Library 연동
 * - UDF 데이터피드: /api/udf (백엔드에서 바이낸스 캔들 제공)
 * - 라이브러리 파일: public/charting_library/ 에 배치 필요 (TradingView 라이선스)
 * @see docs/TRADINGVIEW-SETUP.md
 */
import { useEffect, useRef, useState } from 'react'
import { useAppStore } from '@/store/useAppStore'
import './ChartPanel.css'

const CHARTING_LIBRARY_SCRIPT = '/charting_library/charting_library.standalone.js'
const UDF_BASE_URL = '/api/udf'

/** 스토어 타임프레임 → TradingView resolution */
function getResolution(timeframe: string): string {
  const map: Record<string, string> = {
    '1m': '1',
    '5m': '5',
    '15m': '15',
    '30m': '30',
    '1H': '60',
    '4H': '240',
    '1D': '1D',
    '1W': '1W',
  }
  return map[timeframe] ?? '60'
}

declare global {
  interface Window {
    TradingView?: {
      widget: (options: Record<string, unknown>) => { remove?: () => void }
    }
    Datafeeds?: {
      UDFCompatibleDatafeed: new (url: string, updateFrequency?: number) => unknown
    }
  }
}

export function TradingViewChartPanel() {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetRef = useRef<ReturnType<Window['TradingView']['widget']> | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { symbol, timeframe } = useAppStore()

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const initWidget = () => {
      const TV = window.TradingView
      const Datafeeds = window.Datafeeds
      if (!TV?.widget || !Datafeeds?.UDFCompatibleDatafeed) {
        setError('TradingView Charting Library를 불러올 수 없습니다.')
        return
      }
      try {
        if (widgetRef.current?.remove) {
          widgetRef.current.remove()
          widgetRef.current = null
        }
        const datafeed = new Datafeeds.UDFCompatibleDatafeed(UDF_BASE_URL, 10 * 1000)
        widgetRef.current = TV.widget({
          container,
          library_path: '/charting_library/',
          locale: 'ko',
          symbol,
          interval: getResolution(timeframe),
          datafeed,
          theme: 'dark',
          fullscreen: false,
          autosize: true,
          studies_overrides: {},
          disabled_features: ['use_localstorage_for_settings'],
          enabled_features: ['study_templates'],
        })
        setError(null)
      } catch (e) {
        setError(e instanceof Error ? e.message : '차트 초기화 실패')
      }
    }

    if (window.TradingView?.widget && window.Datafeeds?.UDFCompatibleDatafeed) {
      initWidget()
      return () => {
        if (widgetRef.current?.remove) {
          widgetRef.current.remove()
          widgetRef.current = null
        }
      }
    }

    setError(null)
    const script = document.createElement('script')
    script.src = CHARTING_LIBRARY_SCRIPT
    script.async = true
    script.onload = () => {
      initWidget()
    }
    script.onerror = () => {
      setError(
        'TradingView Charting Library 파일이 없습니다. public/charting_library/ 폴더에 라이브러리를 배치하고, 라이선스 안내를 확인하세요.'
      )
    }
    document.head.appendChild(script)
    return () => {
      script.remove()
      if (widgetRef.current?.remove) {
        widgetRef.current.remove()
        widgetRef.current = null
      }
    }
  }, [symbol, timeframe])

  if (error) {
    return (
      <section className="chart-panel">
        <div className="chart-tv-placeholder">
          <p className="chart-tv-placeholder-title">TradingView Charting Library</p>
          <p className="chart-tv-placeholder-message">{error}</p>
          <p className="chart-tv-placeholder-hint">
            <code>public/charting_library/</code> 에 Charting Library 파일을 넣거나,{' '}
            <a href="https://www.tradingview.com/charting-library-docs/" target="_blank" rel="noopener noreferrer">
              TradingView 문서
            </a>
            를 참고해 라이선스 및 설치 방법을 확인하세요.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="chart-panel chart-panel-tv">
      <div ref={containerRef} className="chart-tv-container" />
    </section>
  )
}
