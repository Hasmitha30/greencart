import React from 'react'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js'
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

export default function KPIChart({ data }){
  const labels = (Array.isArray(data) ? data : data.details || []).map((d,i)=> d.orderId || d.order || ('#'+(i+1)))
  const profits = (Array.isArray(data) ? data : data.details || []).map(d=> d.profit ?? d.order_profit ?? 0)
  const fuel = (Array.isArray(data) ? data : data.details || []).map(d=> d.fuelCost ?? d.fuel_cost ?? 0)

  const chartData = {
    labels,
    datasets: [
      { label: 'Profit', data: profits },
      { label: 'Fuel', data: fuel }
    ]
  }
  return <div className="bg-white p-4 rounded shadow"><Bar data={chartData} /></div>
}
