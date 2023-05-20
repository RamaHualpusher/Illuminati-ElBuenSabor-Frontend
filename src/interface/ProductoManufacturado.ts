import { Rubro } from "./Rubro";
import { Ingrediente } from "./Ingrediente";
export interface ProductoManufacturado {
  idProductoManufacturado: number;
  nombre: string;
  tiempoEstimadoCocina: number;
  denominacion: string;
  imagen: string;
  stockActual: number;
  stockMinimo: number;
  preparacion: string;
  Ingrediente: Ingrediente[];
  Rubro: Rubro;
}
