import { Pedido } from "./Pedido";
import { Producto } from "./Producto";

export interface DetallePedido {
  idDetallePedido: number;
  cantidad: number;
  // Pedido?: Pedido; cambio 20/9/23
  Productos: Producto; 
}
