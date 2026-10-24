import { FC, JSX, useState } from 'react'
import { Machine, StatsResponse } from '../types'
import { IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

interface readStats {
  machine: Machine
  stats: StatsResponse | null
  onRemove: (machine: Machine) => void
}

const Card: FC<readStats> = ({ stats, machine, onRemove }): JSX.Element => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false)

  if (!stats) {
    return (
      <div className="bg-zinc-800 rounded-xl p-4 w-64">
        <h2 className="text-white font-semibold text-lg mb-3">{machine.name}</h2>
        <p className="text-zinc-500 text-sm">Connecting...</p>
      </div>
    )
  }

  return (
    <div
      onClick={() => setIsExpanded(!isExpanded)}
      className="bg-zinc-800 rounded-xl p-4 w-64 cursor-pointer hover:bg-zinc-700 transition-colors"
    >
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-white font-semibold text-lg">{stats.hostname}</h2>
        <IconButton
          aria-label="delete"
          onClick={(e) => {
            e.stopPropagation()
            onRemove(machine)
          }}
        >
          <DeleteIcon />
        </IconButton>
      </div>

      <div className="flex justify-between text-sm text-zinc-400 mb-3 ">
        <span>CPU: {stats.cpu_percent.toPrecision(1)}%</span>
        <span>MEM: {stats.memory_percent.toPrecision(3)}%</span>
      </div>
      <hr className="border-zinc-700 my-2" />
      <div className="space-y-1">
        {stats.top_processes.slice(0, isExpanded ? 10 : 1).map((proc) => (
          <div key={proc.pid} className="flex justify-between text-xs text-zinc-500">
            <span>{proc.name}</span>
            <span>{proc.cpu_percent}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Card
