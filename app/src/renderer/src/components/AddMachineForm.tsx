import { FC, useState } from 'react'
import { Machine } from '../types'

interface AddMachineFormProps {
  onAdd: (machine: Machine) => void
}

const AddMachineForm: FC<AddMachineFormProps> = ({ onAdd }) => {
  const [name, setName] = useState('')
  const [ip, setIp] = useState('')
  const [port, setPort] = useState(8000)

  const handleSubmit = (e: React.SyntheticEvent) => {
    // 1. build a Machine object using crypto.randomUUID(), name, ip, port
    // 2. call onAdd with it
    // 3. reset the form fields
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
    <div>
      <form onSubmit={handleSubmit}>
        {/* input for name */}
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Machine Name"
        ></input>
        {/* input for ip */}
        <input value={ip} onChange={(e) => setIp(e.target.value)} placeholder="IP address"></input>
        {/* input for port */}
        <input
          value={port}
          onChange={(e) => setPort(e.target.valueAsNumber)}
          placeholder="Machine Name"
        ></input>
        {/* submit button that calls handleSubmit */}
        <input type="submit" />
      </form>
    </div>
  )
}

export default AddMachineForm;
