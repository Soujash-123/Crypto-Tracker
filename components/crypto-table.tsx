"use client"

import { useSelector, useDispatch } from "react-redux"
import { selectCryptoList, selectCryptoStatus, selectCryptoError } from "@/lib/features/crypto/cryptoSelectors"
import { setSelectedCrypto } from "@/lib/features/crypto/cryptoSlice"
import { formatCurrency, formatPercentage, formatSupply } from "@/lib/utils"
import SparklineChart from "@/components/sparkline-chart"
import { ArrowDown, ArrowUp } from "lucide-react"

export default function CryptoTable() {
  const dispatch = useDispatch()
  const cryptoList = useSelector(selectCryptoList)
  const status = useSelector(selectCryptoStatus)
  const error = useSelector(selectCryptoError)

  const handleChartClick = (symbol: string) => {
    dispatch(setSelectedCrypto(symbol))
  }

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 dark:border-gray-100"></div>
      </div>
    )
  }

  if (status === "failed") {
    return <div className="text-red-500 p-4 border border-red-300 rounded">Error: {error}</div>
  }

  // Add this check for empty data
  if (cryptoList.length === 0 && status === "succeeded") {
    return (
      <div className="text-center p-8">
        <p className="text-lg">Waiting for cryptocurrency data...</p>
        <p className="text-sm text-gray-500 mt-2">
          The WebSocket connection is established, but we're still waiting for the first data update.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800">
            <th className="p-3 text-left">#</th>
            <th className="p-3 text-left">Logo</th>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Symbol</th>
            <th className="p-3 text-right">Price</th>
            <th className="p-3 text-right">1h %</th>
            <th className="p-3 text-right">24h %</th>
            <th className="p-3 text-right">7d %</th>
            <th className="p-3 text-right">Market Cap</th>
            <th className="p-3 text-right">24h Volume</th>
            <th className="p-3 text-right">Circulating Supply</th>
            <th className="p-3 text-right">Max Supply</th>
            <th className="p-2 text-center">7D Chart</th>
          </tr>
        </thead>
        <tbody>
          {cryptoList.map((crypto, index) => (
            <tr
              key={crypto.symbol}
              className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
            >
              <td className="p-3">{index + 1}</td>
              <td className="p-3">
                <img
                  src={`https://cryptoicons.org/api/icon/${crypto.symbol.toLowerCase()}/30`}
                  alt={crypto.name}
                  className="w-6 h-6"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg?height=24&width=24"
                  }}
                />
              </td>
              <td className="p-3 font-medium">{crypto.name}</td>
              <td className="p-3">{crypto.symbol}</td>
              <td className="p-3 text-right font-medium">{formatCurrency(crypto.price)}</td>
              <td className={`p-3 text-right ${crypto.priceChange1h >= 0 ? "text-green-500" : "text-red-500"}`}>
                <div className="flex items-center justify-end">
                  {crypto.priceChange1h >= 0 ? (
                    <ArrowUp className="w-4 h-4 mr-1" />
                  ) : (
                    <ArrowDown className="w-4 h-4 mr-1" />
                  )}
                  {formatPercentage(crypto.priceChange1h)}
                </div>
              </td>
              <td className={`p-3 text-right ${crypto.priceChange24h >= 0 ? "text-green-500" : "text-red-500"}`}>
                <div className="flex items-center justify-end">
                  {crypto.priceChange24h >= 0 ? (
                    <ArrowUp className="w-4 h-4 mr-1" />
                  ) : (
                    <ArrowDown className="w-4 h-4 mr-1" />
                  )}
                  {formatPercentage(crypto.priceChange24h)}
                </div>
              </td>
              <td className={`p-3 text-right ${crypto.priceChange7d >= 0 ? "text-green-500" : "text-red-500"}`}>
                <div className="flex items-center justify-end">
                  {crypto.priceChange7d >= 0 ? (
                    <ArrowUp className="w-4 h-4 mr-1" />
                  ) : (
                    <ArrowDown className="w-4 h-4 mr-1" />
                  )}
                  {formatPercentage(crypto.priceChange7d)}
                </div>
              </td>
              <td className="p-3 text-right">{formatCurrency(crypto.marketCap)}</td>
              <td className="p-3 text-right">{formatCurrency(crypto.volume24h)}</td>
              <td className="p-3 text-right">
                {formatSupply(crypto.circulatingSupply)} {crypto.symbol}
              </td>
              <td className="p-3 text-right">
                {crypto.maxSupply ? formatSupply(crypto.maxSupply) + " " + crypto.symbol : "N/A"}
              </td>
              <td className="p-3 w-64">
                <div className="cursor-pointer w-full" onClick={() => handleChartClick(crypto.symbol)}>
                  <SparklineChart data={crypto.sparkline7d} color={crypto.priceChange1h >= crypto.priceChange7d ? "#10b981" : "#ef4444"} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
