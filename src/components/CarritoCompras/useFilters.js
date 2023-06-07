import { useContext } from 'react'
import { FiltersContext } from '../context/filters.jsx'

// En esta sección se importa el hook useContext
//  de la librería de React y se importa el contexto FiltersContext
//  desde un archivo filters.jsx en la carpeta context.
export function useFilters () {
  const { filters, setFilters } = useContext(FiltersContext)

  // En esta sección, se define la función useFilters como una función exportada. 
  // Dentro de la función, se utiliza el hook useContext para obtener los 
  // valores del contexto FiltersContext. La desestructuración se utiliza para asignar 
  // los valores filters y setFilters del contexto a las variables correspondientes.
  const filterProducts = (products) => {
    return products.filter(product => {
      return (
        product.price >= filters.minPrice &&
        (
          filters.category === 'all' ||
          product.category === filters.category
        )
      )
    })
  }

  return { filters, filterProducts, setFilters }
}
