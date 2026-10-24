import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      getStats: (ip: string, port: number) => Promise<StatsResponse>
      getMachines: () => Promise<Machine[]>
      saveMachines: (machines: Machine[]) => Promise<void>
    }
  }
}
