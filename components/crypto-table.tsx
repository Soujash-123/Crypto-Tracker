"use client"

import { useSelector, useDispatch } from "react-redux"
import { selectFilteredCryptoList, selectCryptoStatus, selectCryptoError } from "@/lib/features/crypto/cryptoSelectors"
import { setSelectedCrypto, setSearchFilter, setPerformanceFilter, setSortConfig } from "@/lib/features/crypto/cryptoSlice"
import { formatCurrency, formatPercentage, formatSupply } from "@/lib/utils"
import SparklineChart from "@/components/sparkline-chart"
import { ArrowDown, ArrowUp, Search, ArrowUpDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { CryptoData } from "@/lib/types"
import { useState } from "react"

export default function CryptoTable() {
  const dispatch = useDispatch()
  const cryptoList = useSelector(selectFilteredCryptoList)
  const status = useSelector(selectCryptoStatus)
  const error = useSelector(selectCryptoError)
  const [currentSort, setCurrentSort] = useState<{ field: keyof CryptoData | null; direction: 'asc' | 'desc' }>({
    field: null,
    direction: 'desc'
  })

  const handleChartClick = (symbol: string) => {
    dispatch(setSelectedCrypto(symbol))
  }

  const handleSearch = (value: string) => {
    dispatch(setSearchFilter(value))
  }

  const handlePerformanceFilter = (filter: 'all' | 'gain' | 'loss') => {
    dispatch(setPerformanceFilter(filter))
  }

  const handleSort = (field: keyof CryptoData) => {
    const direction = currentSort.field === field && currentSort.direction === 'desc' ? 'asc' : 'desc'
    setCurrentSort({ field, direction })
    dispatch(setSortConfig({ field, direction }))
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

  if (cryptoList.length === 0 && status === "succeeded") {
    return (
      <div className="text-center p-8">
        <p className="text-lg">No cryptocurrencies match your filters</p>
      </div>
    )
  }

  const renderSortIcon = (field: keyof CryptoData) => {
    if (currentSort.field !== field) return <ArrowUpDown className="w-4 h-4 ml-1" />
    return currentSort.direction === 'desc' ? 
      <ArrowDown className="w-4 h-4 ml-1" /> : 
      <ArrowUp className="w-4 h-4 ml-1" />
  }

  return (
    <div>
      <div className="mb-4 space-y-4">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search by name or symbol..."
              className="pl-10"
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline"
              onClick={() => handlePerformanceFilter('all')}
            >
              All
            </Button>
            <Button 
              variant="outline"
              onClick={() => handlePerformanceFilter('gain')}
              className="text-green-500"
            >
              Gains
            </Button>
            <Button 
              variant="outline"
              onClick={() => handlePerformanceFilter('loss')}
              className="text-red-500"
            >
              Losses
            </Button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">Logo</th>
              <th className="p-3 text-left cursor-pointer" onClick={() => handleSort('name')}>
                <div className="flex items-center">
                  Name{renderSortIcon('name')}
                </div>
              </th>
              <th className="p-3 text-left cursor-pointer" onClick={() => handleSort('symbol')}>
                <div className="flex items-center">
                  Symbol{renderSortIcon('symbol')}
                </div>
              </th>
              <th className="p-3 text-right cursor-pointer" onClick={() => handleSort('price')}>
                <div className="flex items-center justify-end">
                  Price{renderSortIcon('price')}
                </div>
              </th>
              <th className="p-3 text-right cursor-pointer" onClick={() => handleSort('priceChange1h')}>
                <div className="flex items-center justify-end">
                  1h %{renderSortIcon('priceChange1h')}
                </div>
              </th>
              <th className="p-3 text-right cursor-pointer" onClick={() => handleSort('priceChange24h')}>
                <div className="flex items-center justify-end">
                  24h %{renderSortIcon('priceChange24h')}
                </div>
              </th>
              <th className="p-3 text-right cursor-pointer" onClick={() => handleSort('priceChange7d')}>
                <div className="flex items-center justify-end">
                  7d %{renderSortIcon('priceChange7d')}
                </div>
              </th>
              <th className="p-3 text-right cursor-pointer" onClick={() => handleSort('marketCap')}>
                <div className="flex items-center justify-end">
                  Market Cap{renderSortIcon('marketCap')}
                </div>
              </th>
              <th className="p-3 text-right cursor-pointer" onClick={() => handleSort('volume24h')}>
                <div className="flex items-center justify-end">
                  24h Volume{renderSortIcon('volume24h')}
                </div>
              </th>
              <th className="p-3 text-right cursor-pointer" onClick={() => handleSort('circulatingSupply')}>
                <div className="flex items-center justify-end">
                  Circulating Supply{renderSortIcon('circulatingSupply')}
                </div>
              </th>
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
                    src={`/cryptologo/${crypto.symbol.toLowerCase()}.png`}
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
    </div>
  )
}
