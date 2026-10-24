import { FC, useState } from 'react'
import { Machine } from '../types'
import CloseIcon from '@mui/icons-material/Close'
import { IconButton } from '@mui/material'

interface AddMachineFormProps {
  onAdd: (machine: Machine) => void
  onClose: () => void
}

const AddMachineForm: FC<AddMachineFormProps> = ({ onAdd, onClose }) => {
  const [name, setName] = useState('')
  const [ip, setIp] = useState('')
  const [port, setPort] = useState(8000)

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault()
    const newMachine: Machine = {
      id: crypto.randomUUID(),
      name,
      ip,
      port
    }
    onAdd(newMachine)
    setName('')
    setIp('')
    setPort(8000)
  }

  return (
    <div className="">
      <form onSubmit={handleSubmit} className="pt-3 grid grid-rows-5 gap-y-3 w-64">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Machine Name"
          className="p-2 border border-gray-500 bg-transparent text-white rounded focus:outline-none focus:border-blue-500"
        ></input>
        <input
          value={ip}
          onChange={(e) => setIp(e.target.value)}
          placeholder="IP address"
          className="p-2 border border-gray-500 bg-transparent text-white rounded focus:outline-none focus:border-blue-500"
        ></input>
        <input
          value={port}
          onChange={(e) => setPort(e.target.valueAsNumber)}
          placeholder="Port"
          className="p-2 border border-gray-500 bg-transparent text-white rounded focus:outline-none focus:border-blue-500"
        ></input>
        <div className="flex justify-between items-center">
          <input
            type="submit"
            className="cursor-pointer text-white  bg-zinc-700 rounded px-6 py-2 hover:bg-zinc-600"
          />
          <IconButton onClick={onClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </div>
      </form>
    </div>
  )
}

export default AddMachineForm
