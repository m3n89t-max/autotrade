import { create } from 'zustand'
import type { AppState, WatchlistRow, Timeframe, Exchange } from '@/types/app'

const defaultWave = {
  primary: '',
  alternative: '',
  invalidation: null as number | null,
  triggers: [] as { price: number; label?: string }[],
  targets: [] as { price: number; label: string }[],
}

const defaultAppState: AppState = {
  symbol: 'BTCUSDT',
  timeframe: '1H',
  exchange: 'Binance',
  wave: defaultWave,
  econ: { events: [], blackoutWindows: [] },
  orders: { openOrders: [], positions: [] },
  ui: {
    activeTab: 'ai',
    modals: [],
    strategyOn: false,
    brokerConnected: true,
    wsConnected: true,
  },
}

const mockWatchlist: WatchlistRow[] = [
  { symbol: 'BTCUSDT', last: 67200, changePercent: 2.1, volume: 1_200_000_000, wave: 'Impulse', trigger: 85 },
  { symbol: 'ETHUSDT', last: 3520, changePercent: -0.5, volume: 800_000_000, wave: 'Corrective', trigger: 40 },
  { symbol: 'SOLUSDT', last: 148, changePercent: 5.2, volume: 300_000_000, wave: 'Unclear', trigger: 20 },
]

export const useAppStore = create<AppState & {
  watchlist: WatchlistRow[]
  setSymbol: (s: string) => void
  setTimeframe: (t: Timeframe) => void
  setExchange: (e: Exchange) => void
  setWave: (w: Partial<AppState['wave']>) => void
  setActiveTab: (tab: 'ai' | 'econ' | 'notes') => void
  setStrategyOn: (on: boolean) => void
  openModal: (id: string) => void
  closeModal: (id: string) => void
}>((set) => ({
  ...defaultAppState,
  watchlist: mockWatchlist,

  setSymbol: (symbol) => set({ symbol }),
  setTimeframe: (timeframe) => set({ timeframe }),
  setExchange: (exchange) => set({ exchange }),
  setWave: (wave) => set((s) => ({ wave: { ...s.wave, ...wave } })),
  setActiveTab: (activeTab) => set((s) => ({ ui: { ...s.ui, activeTab } })),
  setStrategyOn: (strategyOn) => set((s) => ({ ui: { ...s.ui, strategyOn } })),
  openModal: (id) => set((s) => ({ ui: { ...s.ui, modals: [...s.ui.modals, id] } })),
  closeModal: (id) => set((s) => ({ ui: { ...s.ui, modals: s.ui.modals.filter((m) => m !== id) } })),
}))
