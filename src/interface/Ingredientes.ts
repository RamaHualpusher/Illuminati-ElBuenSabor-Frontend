import { Rubro } from "./Rubro";
import { ProductoIngrediente } from './ProductoIngrediente';

export interface Ingredientes {
  idIngredientes: number;
  nombre: string;
  estado: boolean;
  stockMinimo: number;
  stockActual: number;
  Rubro: Rubro;
  unidadMedida: string;
  ProductoIngrediente: ProductoIngrediente[];
}
