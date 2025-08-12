import React, {useState} from 'react'
import api from '../utils/api'
import { setToken } from '../utils/auth'
import { useNavigate } from 'react-router-dom'

export default function Login(){
  const [email,setEmail]=useState('manager@example.com')
  const [password,setPassword]=useState('password123')
  const [loading,setLoading]=useState(false)
  const nav = useNavigate()

  async function submit(e){
    e.preventDefault()
    setLoading(true)
    try{
      const r = await api.post('/api/auth/login',{ email, password })
      setToken(r.data.token)
      nav('/')
    }catch(err){
      alert('Login failed: '+ (err.response?.data?.error || err.message))
    }finally{ setLoading(false) }
  }

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-6 rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Login</h2>
      <form onSubmit={submit} className="space-y-3">
        <input value={email} onChange={e=>setEmail(e.target.value)} className="w-full p-2 border rounded" />
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full p-2 border rounded" />
        <button disabled={loading} className="w-full bg-green-600 text-white p-2 rounded">
          {loading? 'Signing in...':'Sign in'}
        </button>
      </form>
    </div>
  )
}
