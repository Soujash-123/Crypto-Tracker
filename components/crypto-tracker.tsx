"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Provider } from "react-redux"
import { store } from "@/lib/store"
import CryptoTable from "@/components/crypto-table"
import CryptoModal from "@/components/crypto-modal"
import { connectWebSocket, disconnectWebSocket } from "@/lib/features/crypto/cryptoSlice"
import { selectSelectedCrypto } from "@/lib/features/crypto/cryptoSelectors"

function CryptoTrackerContent() {
  const dispatch = useDispatch()
  const selectedCrypto = useSelector(selectSelectedCrypto)

  useEffect(() => {
    console.log("Connecting to WebSocket...")
    dispatch(connectWebSocket())

    return () => {
      console.log("Disconnecting from WebSocket...")
      dispatch(disconnectWebSocket())
    }
  }, [dispatch])

  return (
    <div>
      <CryptoTable />
      {selectedCrypto && <CryptoModal />}
    </div>
  )
}

export default function CryptoTracker() {
  return (
    <Provider store={store}>
      <CryptoTrackerContent />
    </Provider>
  )
}
