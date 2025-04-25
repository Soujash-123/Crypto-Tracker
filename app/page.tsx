import CryptoTracker from "@/components/crypto-tracker"

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Cryptocurrency Price Tracker</h1>
      <CryptoTracker />
    </main>
  )
}
