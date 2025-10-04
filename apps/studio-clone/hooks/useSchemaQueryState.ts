import { useState } from 'react'

export function useQuerySchemaState() {
  const [selectedSchema, setSelectedSchema] = useState('public')

  return {
    selectedSchema,
    setSelectedSchema,
  }
}
