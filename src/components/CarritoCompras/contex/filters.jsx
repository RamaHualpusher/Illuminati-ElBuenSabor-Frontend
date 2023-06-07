import { createContext, useState } from 'react'

// basicamente con EventSource, creamos, proveemos y luego consumimos el filtro
// lo que hice en el main.jsx es "envolver" la app con FilterProvider

// Este es el que tenemos que consumir
export const FiltersContext = createContext()

// Este es el que nos provee de acceso al contexto
export function FiltersProvider ({ children }) {
  const [filters, setFilters] = useState({
    category: 'all',
    minPrice: 250
  })

  return (
    <FiltersContext.Provider value={{
      filters,
      setFilters
    }}
    >
      {children}
    </FiltersContext.Provider>
  )
}
