"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import type { CandlestickData } from "@/lib/types"

// Dynamically import ApexCharts with no SSR to avoid hydration issues
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false })

interface CandlestickChartProps {
  data: CandlestickData[]
}

export default function CandlestickChart({ data }: CandlestickChartProps) {
  const [chartError, setChartError] = useState<string | null>(null)

  // Format data for ApexCharts
  const formattedData = data.map((item) => ({
    x: new Date(item.time * 1000), // Convert seconds to milliseconds
    y: [item.open, item.high, item.low, item.close],
  }))

  // Chart options
  const options = {
    chart: {
      type: "candlestick" as const,
      height: 400,
      toolbar: {
        show: true,
        tools: {
          download: false,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
        },
      },
      background: "transparent",
    },
    title: {
      text: "Price History",
      align: "left" as const,
    },
    xaxis: {
      type: "datetime" as const,
      labels: {
        datetimeUTC: false,
      },
    },
    yaxis: {
      tooltip: {
        enabled: true,
      },
      labels: {
        formatter: (value: number) => {
          return value.toFixed(2)
        },
      },
    },
    plotOptions: {
      candlestick: {
        colors: {
          upward: "#10b981", // Green for up candles
          downward: "#ef4444", // Red for down candles
        },
        wick: {
          useFillColor: true,
        },
      },
    },
    tooltip: {
      enabled: true,
      theme: "light",
      x: {
        format: "MMM dd HH:mm",
      },
    },
    grid: {
      borderColor: "#f1f1f1",
    },
  }

  // Series data
  const series = [
    {
      name: "Price",
      data: formattedData,
    },
  ]

  if (chartError) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-500 p-4 text-center">
          <p>{chartError}</p>
        </div>
      </div>
    )
  }

  // Check if we're in a browser environment
  if (typeof window === "undefined") {
    return <div className="h-full w-full bg-gray-100 dark:bg-gray-800 rounded-lg"></div>
  }

  return (
    <div className="w-full h-full">
      {data.length > 0 ? (
        <ApexChart
          options={options}
          series={series}
          type="candlestick"
          height={400}
          width="100%"
          onError={() => setChartError("Failed to render chart. Please try again later.")}
        />
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">No data available</p>
        </div>
      )}
    </div>
  )
}
