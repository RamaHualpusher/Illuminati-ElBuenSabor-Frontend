export interface Column<T> {
  title: string; // Título de la columna
  field: keyof T; // Campo correspondiente en los datos
  width?: number; // Ancho de la columna (opcional)
  render?: (row: T) => JSX.Element | null; // Función de renderizado personalizado para la celda (opcional)
}

export interface Action {
  create?: boolean; // Permitir la acción de creación (opcional)
  update?: boolean; // Permitir la acción de actualización (opcional)
  delete?: boolean; // Permitir la acción de eliminación (opcional)
  view?: boolean; // Permitir la acción de visualización (opcional)
}

export interface TableProps<T> {
  data: T[]; // Datos para mostrar en la tabla
  columns: Column<T>[]; // Columnas de la tabla
  actions: Action; // Acciones disponibles para la tabla
  onAdd?: () => void; // Manejador de evento para la acción de agregar (opcional)
  onUpdate?: (item: T) => void; // Manejador de evento para la acción de actualización (opcional)
  onDelete?: (item: T) => void; // Manejador de evento para la acción de eliminación (opcional)
  onView?: (item: T) => void; // Manejador de evento para la acción de visualización (opcional)
  customSearch?: (searchText: string) => Promise<T[]>; // Función de búsqueda personalizada (opcional)
}