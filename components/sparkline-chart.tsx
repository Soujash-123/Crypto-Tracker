"use client"
import { Line, LineChart, ResponsiveContainer, YAxis } from "recharts"

interface SparklineChartProps {
  data: number[]
  color: string
}

export default function SparklineChart({ data, color }: SparklineChartProps) {
  // Convert the data array to the format expected by Recharts
  const chartData = data.map((value, index) => ({ value, index }))

  // Calculate min and max for better visualization
  const minValue = Math.min(...data) * 0.99
  const maxValue = Math.max(...data) * 1.01

  return (
    <ResponsiveContainer width="200%" height={40}>
      <LineChart data={chartData} style={{ width: '200%', marginLeft: '-25%' }}>
        <YAxis domain={[minValue, maxValue]} hide />
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={1.5}
          dot={false}
          isAnimationActive={true}
          yAxisId={0}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
