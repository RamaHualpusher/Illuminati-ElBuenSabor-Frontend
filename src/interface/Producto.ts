import { Rubro } from "./Rubro";
import { DetallePedido } from './DetallePedido';
import { ProductoIngrediente } from './ProductoIngrediente';

export interface Producto{
  idProducto: number;
  nombre: string;
  tiempoEstimadoCocina: number;
  denominacion: string;
  imagen: string;
  stockActual: number;
  stockMinimo: number;
  preparacion: string;  
  precio: number;
  esBebida: boolean;
  Rubro: Rubro;
  DetallePedido: DetallePedido[];
  ProductoIngrediente: ProductoIngrediente[];
}
