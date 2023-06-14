import { Articulo } from './Articulo';
import { Pedido } from './Pedido';
import { ProductoManufacturado } from './ProductoManufacturado';

export interface DetallePedido {
    idDetallePedido: number;
    cantidad: number;
    subtotal: number;
    Articulo: Articulo[];
    Pedido: Pedido[];
    ProductoManufacturado: ProductoManufacturado[];    
  }