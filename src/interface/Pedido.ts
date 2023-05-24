import { TipoEntregaPedido } from "./TipoEntregaPedido";
import { EstadoPedido } from "./EstadoPedido";
import { TipoPago } from "./TipoPago";
import { Usuario } from "./Usuario";
import { Articulo } from "./Articulo";
import { ProductoManufacturado } from "./ProductoManufacturado";

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
  Articulo: Articulo[];
  ProductoManufacturado: ProductoManufacturado[];
}
