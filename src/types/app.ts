/** UI개발정의서 §8 상태 관리 모델 */

export type Exchange = 'Binance' | 'NYSE' | string
export type Timeframe = '1m' | '5m' | '15m' | '30m' | '1H' | '4H' | '1D' | '1W'

export type WaveLabel = 'Impulse' | 'Corrective' | 'Unclear'

export interface WaveState {
  primary: string
  alternative: string
  invalidation: number | null
  triggers: { price: number; label?: string }[]
  targets: { price: number; label: string }[]
}

export interface EconEvent {
  id: string
  timeET: string
  event: string
  impact: 'High' | 'Medium' | 'Low'
  forecast: string | null
  actual: string | null
  previous: string | null
  surprise: number | null
  countdownMinutes: number | null
}

export interface BlackoutWindow {
  eventId: string
  start: string
  end: string
}

export interface Order {
  id: string
  symbol: string
  side: 'Long' | 'Short'
  type: 'Market' | 'Limit' | 'Stop'
  quantity: number
  entryPrice?: number
  stopLoss?: number
  takeProfit?: number
  status: string
}

export interface Position {
  symbol: string
  entry: number
  size: number
  pnl: number
  sl: number | null
  tp: number | null
}

export interface WatchlistRow {
  symbol: string
  last: number
  changePercent: number
  volume: number
  wave: WaveLabel
  trigger: number
}

export interface AppState {
  symbol: string
  timeframe: Timeframe
  exchange: Exchange
  wave: WaveState
  econ: {
    events: EconEvent[]
    blackoutWindows: BlackoutWindow[]
  }
  orders: {
    openOrders: Order[]
    positions: Position[]
  }
  ui: {
    activeTab: 'ai' | 'econ' | 'notes'
    modals: string[]
    strategyOn: boolean
    brokerConnected: boolean
    wsConnected: boolean
  }
}
