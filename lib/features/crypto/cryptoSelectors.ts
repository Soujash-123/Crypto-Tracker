import type { RootState } from "@/lib/store"
import type { CryptoData } from "@/lib/types"

// Select the entire crypto state
export const selectCryptoState = (state: RootState) => state.crypto

// Select the list of cryptocurrencies
export const selectCryptoList = (state: RootState) => state.crypto.cryptoList

// Select the loading status
export const selectCryptoStatus = (state: RootState) => state.crypto.status

// Select any error message
export const selectCryptoError = (state: RootState) => state.crypto.error

// Select the currently selected cryptocurrency symbol
export const selectSelectedCrypto = (state: RootState) => state.crypto.selectedCrypto

// Select the candlestick data
export const selectCandlestickData = (state: RootState) => state.crypto.candlestickData

// Select data for the currently selected cryptocurrency
export const selectSelectedCryptoData = (state: RootState) => {
  const selectedSymbol = state.crypto.selectedCrypto
  if (!selectedSymbol) return null

  return state.crypto.cryptoList.find((crypto) => crypto.symbol === selectedSymbol) || null
}

// Select the filtered and sorted crypto list
export const selectFilteredCryptoList = (state: RootState) => {
  let filtered = [...state.crypto.cryptoList]

  // Apply search filter
  if (state.crypto.filters.search) {
    const searchTerm = state.crypto.filters.search.toLowerCase()
    filtered = filtered.filter(
      crypto => 
        crypto.name.toLowerCase().includes(searchTerm) || 
        crypto.symbol.toLowerCase().includes(searchTerm)
    )
  }

  // Apply performance filter
  if (state.crypto.filters.performance !== 'all') {
    filtered = filtered.filter(crypto => {
      const isGain = crypto.priceChange24h >= 0
      return state.crypto.filters.performance === 'gain' ? isGain : !isGain
    })
  }

  // Apply sorting
  if (state.crypto.sort.field) {
    filtered.sort((a, b) => {
      const aVal = a[state.crypto.sort.field!]
      const bVal = b[state.crypto.sort.field!]
      const modifier = state.crypto.sort.direction === 'asc' ? 1 : -1
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return aVal.localeCompare(bVal) * modifier
      }
      
      return ((aVal as number) - (bVal as number)) * modifier
    })
  }

  return filtered
}
