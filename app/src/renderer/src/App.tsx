import React, { useState, useEffect } from 'react'
import Card from './components/Card'

export type StatsResponse = {
  hostname: string
  cpu_percent: number
  memory_percent: number
  top_processes: {
    pid: string
    name: string
    cpu_percent: number
  }[]
}

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
    <>
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      {stats ? <Card stats={stats} /> : <div>Loading system stats...</div>}
    </>
  )
}

export default App
