import { Pedido } from './Pedido';
import { Producto} from './Producto';

export interface DetallePedido {
    idDetallePedido: number;
    cantidad: number;    
    Pedido: Pedido;
    Producto: Producto;    
  }