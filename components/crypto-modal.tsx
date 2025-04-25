"use client"

import { useEffect, useRef, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import {
  selectSelectedCrypto,
  selectSelectedCryptoData,
  selectCandlestickData,
} from "@/lib/features/crypto/cryptoSelectors"
import { clearSelectedCrypto, fetchCandlestickData } from "@/lib/features/crypto/cryptoSlice"
import { formatCurrency, formatPercentage, formatSupply } from "@/lib/utils"
import { X } from "lucide-react"
import CandlestickChart from "@/components/candlestick-chart"
import { Button } from "@/components/ui/button"

const timeframes = [
  { label: "1M", value: "1m" },
  { label: "6M", value: "6m" },
  { label: "1Y", value: "1y" },
  { label: "5Y", value: "5y" },
]

export default function CryptoModal() {
  const dispatch = useDispatch()
  const selectedSymbol = useSelector(selectSelectedCrypto)
  const cryptoData = useSelector(selectSelectedCryptoData)
  const candlestickData = useSelector(selectCandlestickData)
  const [timeframe, setTimeframe] = useState("1y")
  const modalRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (selectedSymbol) {
      setIsLoading(true)
      dispatch(fetchCandlestickData({ symbol: selectedSymbol, timeframe }) as any)
        .unwrap()
        .then(() => setIsLoading(false))
        .catch(() => setIsLoading(false))
    }
  }, [dispatch, selectedSymbol, timeframe])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        dispatch(clearSelectedCrypto())
      }
    }

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        dispatch(clearSelectedCrypto())
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscapeKey)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscapeKey)
    }
  }, [dispatch])

  if (!selectedSymbol || !cryptoData) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-auto"
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div className="flex items-center">
            <img
              src={`/cryptologo/${cryptoData.symbol.toLowerCase()}.png`}
              alt={cryptoData.name}
              className="w-8 h-8 mr-3"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg?height=32&width=32"
              }}
            />
            <div>
              <h2 className="text-xl font-bold">
                {cryptoData.name} ({cryptoData.symbol})
              </h2>
              <div className="flex items-center">
                <span className="font-medium">{formatCurrency(cryptoData.price)}</span>
                <span className={`ml-2 ${cryptoData.priceChange24h >= 0 ? "text-green-500" : "text-red-500"}`}>
                  {formatPercentage(cryptoData.priceChange24h)} (24h)
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => dispatch(clearSelectedCrypto())}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4">
          <div className="flex space-x-2 mb-4">
            {timeframes.map((tf) => (
              <Button
                key={tf.value}
                variant={timeframe === tf.value ? "default" : "outline"}
                onClick={() => setTimeframe(tf.value)}
                className="px-4 py-2"
              >
                {tf.label}
              </Button>
            ))}
          </div>

          <div className="h-[400px] bg-gray-50 dark:bg-gray-900 rounded-lg">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 dark:border-gray-100"></div>
              </div>
            ) : candlestickData.length > 0 ? (
              <CandlestickChart data={candlestickData} />
            ) : (
              <div className="flex justify-center items-center h-full">
                <p className="text-gray-500">No historical data available</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400">Market Cap</div>
              <div className="font-bold">{formatCurrency(cryptoData.marketCap)}</div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400">24h Volume</div>
              <div className="font-bold">{formatCurrency(cryptoData.volume24h)}</div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400">Circulating Supply</div>
              <div className="font-bold">
                {formatSupply(cryptoData.circulatingSupply)} {cryptoData.symbol}
              </div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
              <div className="text-sm text-gray-500 dark:text-gray-400">Max Supply</div>
              <div className="font-bold">
                {cryptoData.maxSupply ? formatSupply(cryptoData.maxSupply) + " " + cryptoData.symbol : "N/A"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
