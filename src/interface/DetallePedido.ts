import { Producto } from "./Producto";

export interface DetallePedido {
  idDetallePedido: number;
  cantidad: number;
  Productos: Producto[]; //sacar lista
}
