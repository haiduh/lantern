import React, { useState, useEffect } from 'react'
import Card from './components/Card'
import { StatsResponse } from './types'

function App(): React.JSX.Element {
  const [stats, setStats] = useState<StatsResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await window.api.getStats()
        setStats(data)
        setError(null)
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message)
        }
      }
    }

    fetchStats()
    const intervalId = setInterval(fetchStats, 3000)
    return () => clearInterval(intervalId)
  }, [])

  return (
    <div className="w-full h-screen p-6">
      <h1 className="text-white text-center text-2xl font-bold mb-16">Lantern 🏮</h1>
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      <div className="grid grid-cols-3 gap-4">
        {stats ? <Card stats={stats} /> : <div>Loading system stats...</div>}
      </div>
    </div>
  )
}

export default App
