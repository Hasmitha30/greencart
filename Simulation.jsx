import React, {useState} from 'react'
import api from '../utils/api'
import KPIChart from '../components/KPIChart'

export default function Simulation(){
  const [drivers,setDrivers]=useState(3)
  const [maxHours,setMaxHours]=useState(10)
  const [res,setRes]=useState(null)
  const [loading,setLoading]=useState(false)

  async function run(e){
    e.preventDefault()
    setLoading(true)
    try{
      const r = await api.post('/api/simulate',{ available_drivers: Number(drivers), max_hours_per_driver: Number(maxHours) })
      setRes(r.data.result || r.data)
    }catch(err){ alert('Simulation failed: '+ (err.response?.data?.error || err.message)) }
    finally{ setLoading(false) }
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Run Simulation</h2>
      <form onSubmit={run} className="mb-6 grid grid-cols-3 gap-3">
        <input type="number" value={drivers} onChange={e=>setDrivers(e.target.value)} className="p-2 border rounded" />
        <input type="number" value={maxHours} onChange={e=>setMaxHours(e.target.value)} className="p-2 border rounded" />
        <button disabled={loading} className="bg-green-600 text-white p-2 rounded">{loading?'Running...':'Run'}</button>
      </form>

      {res && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Results</h3>
          <pre className="bg-white p-3 rounded shadow mb-3">{JSON.stringify(res, null, 2)}</pre>
          <KPIChart data={res.details || res} />
        </div>
      )}
    </div>
  )
}
