import { FC, JSX, useState } from 'react'
import { Machine, StatsResponse } from '../types'

interface readStats {
  machine: Machine
  stats: StatsResponse | null
}

const Card: FC<readStats> = ({ stats, machine }): JSX.Element => {
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
      <h2 className="text-white font-semibold text-lg mb-3">{stats.hostname}</h2>

      <div className="flex justify-between text-sm text-zinc-400 mb-3 ">
        <span>CPU: {stats.cpu_percent}%</span>
        <span>MEM: {stats.memory_percent}%</span>
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
