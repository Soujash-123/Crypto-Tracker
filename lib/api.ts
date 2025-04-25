import type { CandlestickData } from "@/lib/types"

// Function to fetch historical candlestick data
export async function fetchHistoricalData(symbol: string, timeframe: string): Promise<CandlestickData[]> {
  try {
    // Calculate interval and limit based on timeframe
    const { interval, limit } = getIntervalAndLimit(timeframe)

    // Fetch data from Binance API
    const response = await fetch(
      `https://api.binance.com/api/v3/klines?symbol=${symbol}USDT&interval=${interval}&limit=${limit}`,
    )

    if (!response.ok) {
      console.error(`API Error: ${response.status} ${response.statusText}`)
      throw new Error(`Failed to fetch historical data: ${response.statusText}`)
    }

    const data = await response.json()

    // Check if data is valid
    if (!Array.isArray(data)) {
      console.error("Invalid data format received:", data)
      throw new Error("Invalid data format received from API")
    }

    // Transform the data to the format expected by the chart
    return data.map((item: any) => ({
      time: item[0] / 1000, // Convert timestamp from ms to seconds
      open: Number(item[1]),
      high: Number(item[2]),
      low: Number(item[3]),
      close: Number(item[4]),
    }))
  } catch (error) {
    console.error("Error fetching historical data:", error)
    return []
  }
}

// Helper function to determine interval and limit based on timeframe
function getIntervalAndLimit(timeframe: string): { interval: string; limit: number } {
  switch (timeframe) {
    case "1m":
      return { interval: "1d", limit: 30 } // 1 month: daily candles for 30 days
    case "6m":
      return { interval: "1d", limit: 180 } // 6 months: daily candles for 180 days
    case "1y":
      return { interval: "1w", limit: 52 } // 1 year: weekly candles for 52 weeks
    case "5y":
      return { interval: "1M", limit: 60 } // 5 years: monthly candles for 60 months
    default:
      return { interval: "1d", limit: 30 } // Default to 1 month
  }
}
