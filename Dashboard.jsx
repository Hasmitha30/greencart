import React, {useEffect, useState} from 'react'
import api from '../utils/api'
import KPIChart from '../components/KPIChart'

export default function Dashboard(){
  const [sims,setSims]=useState([])
  const [summary,setSummary]=useState(null)

  useEffect(()=>{ fetchSims() },[])

  async function fetchSims(){
    try{
      const r = await api.get('/api/simulations')
      setSims(r.data || [])
      // compute quick summary from latest sim if exists
      if(r.data && r.data.length){
        const latest = r.data[r.data.length-1]
        setSummary(latest.summary || latest.results || null)
      }
    }catch(e){ console.error(e) }
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
      {summary ? (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded shadow">
            <div className="text-sm text-gray-500">Total Profit</div>
            <div className="text-xl font-bold">₹ {summary.total_profit ?? summary.totalProfit ?? 0}</div>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <div className="text-sm text-gray-500">Efficiency</div>
            <div className="text-xl font-bold">{summary.efficiency_percent ?? summary.efficiency ?? 0}%</div>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <div className="text-sm text-gray-500">On-time</div>
            <div className="text-xl font-bold">{summary.on_time ?? summary.onTime ?? 0}</div>
          </div>
        </div>
      ) : <div className="text-gray-500">No simulations run yet.</div>}
      <h3 className="text-lg font-semibold mb-2">Simulation history</h3>
      <div className="space-y-3">
        {sims.map(s=>(
          <div key={s.id} className="bg-white p-3 rounded shadow">
            <div className="text-sm text-gray-500">{new Date(s.created_at || s.createdAt || s.params?.created_at).toLocaleString()}</div>
            <div className="font-mono text-sm">{JSON.stringify(s.summary || s.results)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
