"use client"

import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { CryptoState, CryptoData } from "@/lib/types"
import { fetchHistoricalData } from "@/lib/api"

const initialState: CryptoState = {
  cryptoList: [],
  selectedCrypto: null,
  candlestickData: [],
  ws: null,
  status: "idle",
  error: null,
}

// Supported cryptocurrencies
const SUPPORTED_SYMBOLS = ["BTCUSDT", "ETHUSDT", "BNBUSDT", "XRPUSDT", "ADAUSDT"]

// Thunk for fetching historical candlestick data
export const fetchCandlestickData = createAsyncThunk(
  "crypto/fetchCandlestickData",
  async ({ symbol, timeframe }: { symbol: string; timeframe: string }) => {
    return await fetchHistoricalData(symbol, timeframe)
  },
)

const cryptoSlice = createSlice({
  name: "crypto",
  initialState,
  reducers: {
    connectWebSocket: (state) => {
      state.status = "loading"
    },
    connectWebSocketSuccess: (state, action: PayloadAction<WebSocket>) => {
      state.ws = action.payload
      state.status = "succeeded"
    },
    connectWebSocketFailure: (state, action: PayloadAction<string>) => {
      state.status = "failed"
      state.error = action.payload
    },
    disconnectWebSocket: (state) => {
      if (state.ws) {
        state.ws.close()
        state.ws = null
      }
    },
    updateCryptoData: (state, action: PayloadAction<CryptoData>) => {
      const index = state.cryptoList.findIndex((crypto) => crypto.symbol === action.payload.symbol)

      if (index !== -1) {
        state.cryptoList[index] = action.payload
      } else {
        state.cryptoList.push(action.payload)
      }
    },
    setSelectedCrypto: (state, action: PayloadAction<string>) => {
      state.selectedCrypto = action.payload
      state.candlestickData = []
    },
    clearSelectedCrypto: (state) => {
      state.selectedCrypto = null
      state.candlestickData = []
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCandlestickData.pending, (state) => {
        // We don't need to set a loading state here
      })
      .addCase(fetchCandlestickData.fulfilled, (state, action) => {
        state.candlestickData = action.payload
      })
      .addCase(fetchCandlestickData.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch candlestick data"
      })
  },
})

// Middleware for WebSocket connection
export const cryptoMiddleware = (store: any) => (next: any) => (action: any) => {
  if (action.type === "crypto/connectWebSocket") {
    try {
      // Connect to Binance WebSocket
      const ws = new WebSocket("wss://stream.binance.com:9443/ws")

      let messageCount = 0

      ws.onopen = () => {
        console.log("WebSocket connected successfully")

        // Subscribe to ticker streams for supported symbols
        const subscribeMsg = {
          method: "SUBSCRIBE",
          params: SUPPORTED_SYMBOLS.map((symbol) => `${symbol.toLowerCase()}@ticker`),
          id: 1,
        }

        console.log("Subscribing to ticker streams:", subscribeMsg.params)
        ws.send(JSON.stringify(subscribeMsg))

        // Dispatch success action with WebSocket instance
        store.dispatch(connectWebSocketSuccess(ws))
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)

          // Log the first few messages to debug
          if (messageCount < 5) {
            console.log("WebSocket message received:", data)
            messageCount++
          }

          // Handle ticker data
          if (data.e === "24hrTicker") {
            const symbol = data.s
            const baseSymbol = symbol.replace("USDT", "")

            // Create crypto data object
            const cryptoData: CryptoData = {
              symbol: baseSymbol,
              name: getCryptoName(baseSymbol),
              price: Number.parseFloat(data.c),
              priceChange1h: Number.parseFloat(data.P) / 24, // Approximation
              priceChange24h: Number.parseFloat(data.P),
              priceChange7d: Number.parseFloat(data.P) * 1.5, // Approximation
              marketCap: Number.parseFloat(data.c) * getCirculatingSupply(baseSymbol),
              volume24h: Number.parseFloat(data.v) * Number.parseFloat(data.c),
              circulatingSupply: getCirculatingSupply(baseSymbol),
              maxSupply: getMaxSupply(baseSymbol),
              sparkline7d: generateSparklineData(Number.parseFloat(data.c), Number.parseFloat(data.P)),
            }

            // Update crypto data in store
            store.dispatch(updateCryptoData(cryptoData))
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error)
        }
      }

      ws.onerror = (error) => {
        console.error("WebSocket error:", error)
        store.dispatch(connectWebSocketFailure("WebSocket connection error"))
      }

      ws.onclose = () => {
        console.log("WebSocket disconnected")
      }
    } catch (error) {
      console.error("Failed to connect WebSocket:", error)
      store.dispatch(connectWebSocketFailure("Failed to connect to WebSocket"))
    }
  }

  return next(action)
}

// Helper functions
function getCryptoName(symbol: string): string {
  const names: Record<string, string> = {
    BTC: "Bitcoin",
    ETH: "Ethereum",
    BNB: "Binance Coin",
    XRP: "Ripple",
    ADA: "Cardano",
  }
  return names[symbol] || symbol
}

function getCirculatingSupply(symbol: string): number {
  const supply: Record<string, number> = {
    BTC: 19000000,
    ETH: 120000000,
    BNB: 155000000,
    XRP: 45000000000,
    ADA: 35000000000,
  }
  return supply[symbol] || 0
}

function getMaxSupply(symbol: string): number | null {
  const supply: Record<string, number | null> = {
    BTC: 21000000,
    ETH: null,
    BNB: 200000000,
    XRP: 100000000000,
    ADA: 45000000000,
  }
  return supply[symbol] !== undefined ? supply[symbol] : null
}

// Update the generateSparklineData function to create more realistic price variations
function generateSparklineData(currentPrice: number, percentChange: number): number[] {
  const data: number[] = []
  const startPrice = currentPrice / (1 + percentChange / 100)

  // Create a more realistic price movement with higher volatility
  let lastPrice = startPrice

  for (let i = 0; i < 168; i++) {
    // 168 hours in a week
    // Create more significant random variations (5% max swing)
    const volatility = 0.05
    const randomChange = (Math.random() - 0.5) * volatility

    // Ensure overall trend follows the percentChange direction
    const trendFactor = percentChange >= 0 ? 1 : -1
    const progressiveTrend = (((i / 167) * Math.abs(percentChange)) / 100) * trendFactor

    // Calculate new price with both trend and volatility
    const newPrice = lastPrice * (1 + progressiveTrend + randomChange)
    data.push(newPrice)
    lastPrice = newPrice
  }

  return data
}

export const {
  connectWebSocket,
  connectWebSocketSuccess,
  connectWebSocketFailure,
  disconnectWebSocket,
  updateCryptoData,
  setSelectedCrypto,
  clearSelectedCrypto,
} = cryptoSlice.actions

export default cryptoSlice.reducer
