import { configureStore } from "@reduxjs/toolkit"
import cryptoReducer, { cryptoMiddleware } from "./features/crypto/cryptoSlice"

export const store = configureStore({
  reducer: {
    crypto: cryptoReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ["crypto/connectWebSocketSuccess", "crypto/disconnectWebSocket"],
        // Ignore these field paths in all actions
        ignoredActionPaths: ["payload.ws"],
        // Ignore these paths in the state
        ignoredPaths: ["crypto.ws"],
      },
    }).concat(cryptoMiddleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
