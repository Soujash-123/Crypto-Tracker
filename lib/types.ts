export interface CryptoState {
  cryptoList: CryptoData[]
  selectedCrypto: string | null
  candlestickData: CandlestickData[]
  ws: WebSocket | null
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
  filters: {
    search: string
    performance: 'all' | 'gain' | 'loss'
  }
  sort: {
    field: keyof CryptoData | null
    direction: 'asc' | 'desc'
  }
}

// Cryptocurrency data
export interface CryptoData {
  symbol: string
  name: string
  price: number
  priceChange1h: number
  priceChange24h: number
  priceChange7d: number
  marketCap: number
  volume24h: number
  circulatingSupply: number
  maxSupply: number | null
  sparkline7d: number[]
}

// Candlestick data for charts
export interface CandlestickData {
  time: number
  open: number
  high: number
  low: number
  close: number
}
