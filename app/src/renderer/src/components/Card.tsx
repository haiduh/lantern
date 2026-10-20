import { FC, JSX, useState } from 'react'
import { StatsResponse } from '@renderer/App'

interface readStats {
  stats: StatsResponse
}

const Card: FC<readStats> = ({ stats }): JSX.Element => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);


  return (
    <div onClick={() => setIsExpanded(!isExpanded)}>
      <h1>Card</h1>

      <ul>
        <li>{stats.hostname}</li>
        <li>{stats.cpu_percent}</li>
        <li>{stats.memory_percent}</li>
        {stats.top_processes.slice(0, isExpanded ? 10 : 1).map((proc) => (
          <div key={proc.pid}>
            <span>{proc.pid}</span>
            <span>{proc.name}</span>
            <span>{proc.cpu_percent}</span>
          </div>
        ))}
      </ul>
    </div>
  )
}

export default Card
