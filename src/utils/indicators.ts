/**
 * 보조 지표 계산 (RSI 등)
 */

export function calcRSI(closes: number[], period: number = 14): (number | null)[] {
  const out: (number | null)[] = []
  for (let i = 0; i < closes.length; i++) {
    if (i < period) {
      out.push(null)
      continue
    }
    let gain = 0
    let loss = 0
    for (let j = i - period + 1; j <= i; j++) {
      const diff = closes[j]! - closes[j - 1]!
      if (diff > 0) gain += diff
      else loss -= diff
    }
    const avgGain = gain / period
    const avgLoss = loss / period
    if (avgLoss === 0) {
      out.push(100)
    } else {
      const rs = avgGain / avgLoss
      out.push(100 - 100 / (1 + rs))
    }
  }
  return out
}

/** 피보나치 되돌림 비율 (0 ~ 1) */
export const FIB_RETRACEMENT = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1] as const

export function fibPrices(low: number, high: number): number[] {
  const range = high - low
  return FIB_RETRACEMENT.map((r) => low + range * r)
}
