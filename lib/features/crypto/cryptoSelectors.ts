import type { RootState } from "@/lib/store"

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
