export interface IColumn<T> {
  title: string; // Título de la columna
  field: keyof T; // Campo correspondiente en los datos
  width?: number; // Ancho de la columna (opcional)
  render?: (row: T) => JSX.Element | null; // Función de renderizado personalizado para la celda (opcional)
}

export interface IAction {
  create?: boolean; // Permitir la acción de creación (opcional)
  update?: boolean; // Permitir la acción de actualización (opcional)
  delete?: boolean; // Permitir la acción de eliminación (opcional)
  view?: boolean; // Permitir la acción de visualización (opcional)
}

export interface ITableProps<T> {
  data: T[]; // Datos para mostrar en la tabla
  columns: IColumn<T>[]; // Columnas de la tabla
  actions: IAction; // Acciones disponibles para la tabla
  onAdd?: () => void; // Manejador de evento para la acción de agregar (opcional)
  onUpdate?: (item: T) => void; // Manejador de evento para la acción de actualización (opcional)
  onDelete?: (item: T) => void; // Manejador de evento para la acción de eliminación (opcional)
  onView?: (item: T) => void; // Manejador de evento para la acción de visualización (opcional)
  customSearch?: (searchText: string) => Promise<T[]>; // Función de búsqueda personalizada (opcional)
  customDate?: (firtsDate:Date|null, secondDate:Date|null) => Promise<T[]>; // Función de busqueda por fechas(opcional)
  showDate?: boolean; // Permite Mostrar busqueda por fecha (opcional)
}