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

export type Machine = {
  id: string
  name: string
  ip: string
  port: number
}