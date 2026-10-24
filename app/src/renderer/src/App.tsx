import React, { useState, useEffect } from 'react'
import Card from './components/Card'
import AddMachineForm from './components/AddMachineForm'
import { Machine, StatsResponse } from './types'
import { Button } from '@mui/material'

function App(): React.JSX.Element {
  const [machines, setMachines] = useState<Machine[]>([])
  const [machineStats, setMachineStats] = useState<Record<string, StatsResponse | null>>({})
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState<boolean>(false)

  const handleAddMachine = async (machine: Machine) => {
    const updated = [...machines, machine]
    setMachines(updated)
    await window.api.saveMachines(updated)
  }

  const handleRemoveMachine = async (machine: Machine) => {
    const updated = machines.filter((m) => m.id !== machine.id)
    setMachines(updated)
    await window.api.saveMachines(updated)
  }

  useEffect(() => {
    const fetchMachines = async () => {
      try {
        const data = await window.api.getMachines()
        setMachines(data)
        setError(null)
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message)
        }
      }
    }
    fetchMachines()
  }, [])

  useEffect(() => {
    const intervals: ReturnType<typeof setInterval>[] = []

    machines.forEach((machine) => {
      const fetchStats = async () => {
        try {
          const data = await window.api.getStats(machine.ip, machine.port)
          setMachineStats((prev) => ({ ...prev, [machine.id]: data }))
        } catch {
          setMachineStats((prev) => ({ ...prev, [machine.id]: null }))
        }
      }

      fetchStats()
      const id = setInterval(fetchStats, 3000)
      intervals.push(id)
    })

    return () => intervals.forEach(clearInterval)
  }, [machines])

  return (
    <div className="w-full h-screen p-6">
      <h1 className="text-white text-center text-2xl font-bold mb-16">Lantern 🏮</h1>
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      <div className="grid grid-cols-3 gap-4">
        {machines.map((machine) => (
          <Card key={machine.id} machine={machine} stats={machineStats[machine.id] ?? null} onRemove={handleRemoveMachine} />
        ))}
      </div>
      <Button
        className="flex justify-center items-center"
        variant="contained"
        onClick={() => setShowForm((prev) => !prev)}
      >
        Add Machine
      </Button>

      {showForm && <AddMachineForm onAdd={handleAddMachine} />}
    </div>
  )
}

export default App
