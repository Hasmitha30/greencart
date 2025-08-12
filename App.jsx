import React from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Simulation from './pages/Simulation'
import { getToken } from './utils/auth'

function Protected({ children }) {
  const token = getToken()
  if (!token) return <Navigate to='/login' replace />
  return children
}

export default function App(){
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto py-4 px-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold">GreenCart</h1>
          <nav className="space-x-4">
            <Link to="/" className="text-sm text-gray-600">Dashboard</Link>
            <Link to="/simulate" className="text-sm text-gray-600">Simulate</Link>
            <Link to="/login" className="text-sm text-gray-600">Login</Link>
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto p-6">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Protected><Dashboard/></Protected>} />
          <Route path="/simulate" element={<Protected><Simulation/></Protected>} />
        </Routes>
      </main>
    </div>
  )
}
