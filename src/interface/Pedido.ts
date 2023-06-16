import { TipoEntregaPedido } from "./TipoEntregaPedido";
import { EstadoPedido } from "./EstadoPedido";
import { TipoPago } from "./TipoPago";
import { Usuario } from "./Usuario";
// import { Articulo } from "./Articulo";
// import { ProductoManufacturado } from "./ProductoManufacturado";
import { DetallePedido } from "./DetallePedido";

export interface Pedido {
  idPedido: number;
  numeroPedido: number;
  fechaPedido: Date;
  horaEstimadaFin: Date;
  tipoEnvio: string;
  TipoEntregaPedido: TipoEntregaPedido;
  EstadoPedido: EstadoPedido;
  TipoPago: TipoPago;
  Usuario: Usuario;
  DetallePedido: DetallePedido[];
}

// Articulo: Articulo[];
  // ProductoManufacturado: ProductoManufacturado[];
